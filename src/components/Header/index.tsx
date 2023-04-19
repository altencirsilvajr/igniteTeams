import { Container,Logo } from './style';
import logoImg from '@assets/logo.png'

export function Header(){
    return(
        <Container>
            <Logo source={logoImg}/>
        </Container>
    )
}