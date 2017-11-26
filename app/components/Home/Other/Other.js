import React, { Component } from 'react';
import { Container, Content, List, ListItem, Text, Separator } from 'native-base';

import Header from './../../Headers/Header';

export default class Other extends Component {

    render() {
        return (
            <Container>
                <Header/>
                <Content>
                    <ListItem last>
                        <Text>Edit Profile</Text>
                    </ListItem>
                    <ListItem last>
                        <Text>Notifications</Text>
                    </ListItem>
                    <Separator bordered/>
                    <ListItem last>
                        <Text>Help Center</Text>
                    </ListItem>
                    <ListItem last>
                        <Text>Privacy Policy</Text>
                    </ListItem>
                    <ListItem last>
                        <Text>Terms & Conditions</Text>
                    </ListItem>
                    <Separator bordered/>
                    <ListItem last>
                        <Text>Logout</Text>
                    </ListItem>
                </Content>
            </Container>
        );
    }
}