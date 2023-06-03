import { TouchableOpacityProps } from "react-native";

import { FilterStyleProps, Container, Title} from "./styles";

type Props = TouchableOpacityProps & FilterStyleProps & {
    title: string;
}

export function Filter({title, isActive = false, ...rest}: Props) {
    return (
        <Container 
        isActive={isActive} 
        {...rest}>
            <Title>
                {title}
            </Title>
        </Container>
    );
}