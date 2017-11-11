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
    Icon,
    Text,
    Form,
    Item,
    Input,
    Label,
    Thumbnail,
    Grid,
    Col
} from 'native-base';

import SuccessDialogue from './SuccessDialogue';

import register from './../../../lib/register/register';

export default class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            first: "",
            last: "",
            email: "",
            password: ""
        };
    }

    register() {
        register.registerUser(
            this.state.first,
            this.state.last,
            this.state.email,
            this.state.password
        ).then(result => {
            alert(JSON.stringify(result));
        }).catch(err => {
            throw err;
        });
    }

    setFirstName(first) {
        this.setState({first});
    }

    setLastName(last) {
        this.setState({last});
    }

    setEmail(email) {
        this.setState({email});
    }

    setPassword(password) {
        this.setState({password})
    }

    render() {
        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem>
                            <Body>
                                <Body>
                                    <Thumbnail source={{uri: 'https://cdn.pixabay.com/photo/2017/05/15/23/48/survey-2316468_1280.png'}} />
                                    <Text>Sign Up!</Text>
                                    <Text note>almost there</Text>
                                </Body>
                            </Body>
                        </CardItem>
                    </Card>
                    <Form>
                        <Item floatingLabel>
                            <Label>First Name</Label>
                            <Input
                                onChangeText={(first) => this.setFirstName(first)}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Last Name</Label>
                            <Input
                                onChangeText={(last) => this.setLastName(last)}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                onChangeText={(email) => this.setEmail(email)}
                                keyboardType={'email-address'}
                                autoCapitalize = 'none'
                            />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Password</Label>
                            <Input
                                onChangeText={(password) => this.setPassword(password)}
                                secureTextEntry={true}
                                autoCapitalize = 'none'
                            />
                        </Item>
                    </Form>
                    <Button full style={styles.registerButton} onPress={() => this.register()}>
                        <Text style={styles.buttonText}>Sign Up</Text>
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
                        <Button full style={styles.loginButton}>
                            <Text style={styles.buttonText}>Have Account? Log In</Text>
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
        marginTop: 4,
        marginLeft: 2
    },
    loginButton: {
        backgroundColor: '#9B59B6'
    },
    registerButton: {
        backgroundColor: '#AEA8D3',
        marginTop: 5
    }
});
