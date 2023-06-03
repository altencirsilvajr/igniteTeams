import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';


import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Container, ContentOne} from './styles';
import { useState,useCallback } from 'react';
import { Alert, FlatList } from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { Loading } from '@components/Loading';


export function Groups() {

  const [isLoading, setIsLoading] = useState(true)
  
  const [group, setGroup] = useState <string[]> ([]);

  const navigation = useNavigation ();

  function handleNewGroup(){
    navigation.navigate('new')
  }

  async function fetchGroups() {
    try{

      setIsLoading(true)
      const data = await groupsGetAll()
      setGroup(data)
    }
    
    catch(error){
      Alert.alert("Turmas:", "Não foi possível carregar as turmas");
    }
    finally {
      setIsLoading(false)
    }
  }

  function handleOpenGroup(group: string){
    navigation.navigate('players', {group})
  }


  useFocusEffect(useCallback(() => {

    fetchGroups();
  },[]));

  return(
    <Container>

      <Header/>

      <ContentOne>
        <Highlight
        title="Turmas"
        subtitle="Jogue com sua turma"
      />
      </ContentOne>
      
    {
      isLoading ? <Loading/> :
      <FlatList 
        data={group}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <GroupCard
            title={item}
            onPress={()=> handleOpenGroup(item)}
          />
        )}

        contentContainerStyle = { group.length === 0 && {flex: 1}}
        ListEmptyComponent={() => (
          <ListEmpty
            message = "Não há turmas cadastradas:"
          />
        )}
      />
    }

      <Button 
        title= "Criar nova Turma"
        onPress={handleNewGroup}
      /> 
  
    </Container>
  );
}