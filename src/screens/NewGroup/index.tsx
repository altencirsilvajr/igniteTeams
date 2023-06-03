import { Container, ContentTwo , Icon} from "./styles";

import { useState } from "react";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";


export function NewGroup(){

    const [group, setGroup] = useState('');

    const navigation = useNavigation();

    async function handleNew(){
        try{
            if(group.trim().length === 0){
                return Alert.alert("Falha ao criar Nova Turma:", "Informe o nome da turma")
            }

            await groupCreate(group)
            navigation.navigate('players',{ group });  
        }

        catch(error){

            if(error instanceof AppError){
                Alert.alert("Falha ao criar Nova Turma:", error.message)
            }
            else {
                Alert.alert("Falha ao criar Nova Turma:", "Não foi possível criar o grupo")
                console.log(error);  
            }
            
        }   
    }

    return(
        <Container>
            <Header showBackButton/>

            <ContentTwo>
                <Icon/>

                <Highlight
                    title="Nova Turma"
                    subtitle="Crie turmas e adicione pessoas"
                />

                <Input
                    placeholder="Nome da turma..."
                    placeholderTextColor= "#7C7C8A"
                    onChangeText={setGroup}
                />  
            </ContentTwo>

            <Button
                title="Criar"
                onPress={handleNew}
            />  
        </Container>
    );
}