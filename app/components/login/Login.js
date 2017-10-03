import React, { Component } from 'react';
import {
    Image,
    StyleSheet
} from 'react-native';

import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    FooterTab,
    Header,
    Text,
    Form,
    Item,
    Input,
    Label,
    Thumbnail,
    Grid,
    Col
} from 'native-base';

export default class Login extends Component {

    render() {
        return (
            <Container>
                <Header style={styles.header}>
                    <Body>
                        <Image source={require('./../../images/logo/topia-sm.png')} style={styles.HeaderImage} />
                    </Body>
                </Header>
                <Content>
                    <Card style={{flex: 0}}>
                        <CardItem>
                            <Body>
                                <Body>
                                    <Thumbnail source={{uri: 'https://cdn.pixabay.com/photo/2017/01/31/08/25/boy-2023213_1280.png'}} />
                                    <Text>Welcome Back!</Text>
                                </Body>
                            </Body>
                        </CardItem>
                    </Card>
                    <Form>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input/>
                        </Item>
                        <Item floatingLabel last>
                            <Label>Password</Label>
                            <Input/>
                        </Item>
                    </Form>
                    <Button full style={styles.loginButton}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </Button>
                    <Grid>
                        <Col>
                            <Button full style={styles.facebookButton}>
                                <Text style={styles.buttonText}>Facebook</Text>
                            </Button>
                        </Col>
                        <Col>
                            <Button full style={styles.linkedInButton}>
                                <Text style={styles.buttonText}>LinkedIn</Text>
                            </Button>
                        </Col>
                    </Grid>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button full style={styles.registerButton}>
                            <Text style={styles.buttonText}>No Account? Sign Up</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#9B59B6'
    },
    HeaderImage: {
        marginBottom: 10
    },
    buttonText: {
        color: 'white'
    },
    facebookButton: {
        backgroundColor: '#3b5998',
        marginTop: 4,
        marginRight: 2
    },
    linkedInButton: {
        backgroundColor: '#0077B5',
        marginTop: 5,
        marginLeft: 2
    },
    loginButton: {
        backgroundColor: '#AEA8D3',
        marginTop: 20
    },
    registerButton: {
        backgroundColor: '#674172'
    }
});
