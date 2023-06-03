import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";

export async function groupRemoveByName(groupDeleted:string){
    try {
        const storageGroups = await groupsGetAll();
        const filteredGroups = await storageGroups.filter(group => group !== groupDeleted);

        const deleteGroup = JSON.stringify(filteredGroups);

        await AsyncStorage.setItem(GROUP_COLLECTION, deleteGroup);
        await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupDeleted}`);

    } catch (error) {
        throw error
    }
}