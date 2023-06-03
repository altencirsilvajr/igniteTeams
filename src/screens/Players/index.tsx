import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Header } from "@components/Header";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { Container, Form , HeaderList, NumberOfPlayers} from "./styles";
import { Alert, FlatList, TextInput } from "react-native";
import { useEffect, useState,useRef } from "react";
import { ContentOne } from "@screens/Groups/styles";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AppError } from "@utils/AppError";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroups } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";



type RouteParams = {
    group: string;
}



export function Players (){

    const [isLoading, setIsLoading] = useState(true)

    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
    

    const route = useRoute();
    const { group } = route.params as RouteParams;
    const navigation = useNavigation();

    const newPlayerNameInputRef = useRef<TextInput>(null);


    async function handleAddPlayer() {
        if(newPlayerName.trim().length === 0){
            return Alert.alert("Novo jogador:", "Insira o nome do jogador.")

        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try{
            await playerAddByGroup(newPlayer, group);
            newPlayerNameInputRef.current?.blur();
            setNewPlayerName('');
            fetchPlayersByTeam();
        }

        catch(error){
            if( error instanceof AppError){
                Alert.alert("Novo jogador:", error.message);
            } 
            else{ 
                console.log(error)
                Alert.alert("Novo jogador:", "Não foi possível adicionar um jogador.")
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        }
        catch(error){
            console.log(error)
            Alert.alert("Aviso:", "Não foi possível carregar as pessoas filtradas do time selecionado");
        }
        finally {
            setIsLoading(false)
        }
    }

    async function handleRemovePlayer(playerName: string){
        try {
            await playerRemoveByGroups(playerName, group);
            fetchPlayersByTeam();
        }
        catch(error){
            Alert.alert("Aviso:", "Não foi possível remover o jogador.")
        }
    }

    async function removeGroup(){
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups')
            
            
        } 
        
        catch (error) {
            Alert.alert("Aviso:", "Não foi possível remover o grupo");
        }
    }

    async function handleRemoveGroup(){
        Alert.alert(
            "AVISO:",
            `O grupo: (${group}) será removido.`,
            [
                {text: 'NÃO', style: 'cancel'},
                {text: 'SIM', onPress: () => removeGroup() }
            ]
        );
    }
    
    useEffect(() => {
        fetchPlayersByTeam(); 
    },[team]);

    return(
        <Container>
            <Header showBackButton/>

            <ContentOne>
                <Highlight 
                title={group}
                subtitle="Adicione e separe os times"
                /> 
            </ContentOne>
            
            
            <Form>
                <Input
                    placeholder="Nome da pessoa"
                    autoCorrect = {false}
                    placeholderTextColor= "#7C7C8A"
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    inputRef = {newPlayerNameInputRef}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />
                
                <ButtonIcon 
                    icon="add" 
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
            <FlatList 
                data={['Time A','Time B', 'Time C']}
                keyExtractor={item => item}
                renderItem={({ item }) =>  (
                    <Filter 
                        title= {item}
                        isActive = {item === team}
                        onPress={() => setTeam(item)}
                    />
                )}
                horizontal
            />
            <NumberOfPlayers>
                {players.length}
            </NumberOfPlayers>
            </HeaderList>

        {
            isLoading ? <Loading/> : 

            <FlatList 
                data={players}
                keyExtractor={item => item.name}
                showsVerticalScrollIndicator= {false}
                renderItem={({ item }) => (
                    <PlayerCard
                        name ={item.name}
                        onRemove={() => handleRemovePlayer(item.name)}
                    />  
                )}
                
                ListEmptyComponent={() => (
                    <ListEmpty
                      message = "Não existem pessoas nesse time"
                    />
                  )}
                contentContainerStyle = {[ {paddingBottom:100}, players.length === 0 && {flex: 1}]}
            />
        }

            <Button
                title="Remover Turma"
                type="SECONDARY"
                onPress={handleRemoveGroup}
            />

            
        </Container>
    );
}