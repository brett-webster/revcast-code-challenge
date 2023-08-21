import React from 'react';
import { Paper, Container, Text, Title, Anchor } from '@mantine/core';

const LandingPage = () => {
    return (
        <Paper shadow="md" p="xl">
            <Container size="md">
                <Title order={1}>Good luck!</Title>
                &nbsp;
                <Text>
                    Please refer to README.md or reach out with any questions
                </Text>
                &nbsp;
                <Text>
                    It is optional to use Mantine Components&nbsp;&nbsp;
                    <Anchor href="https://mantine.dev/" target="_blank">
                        Mantine docs
                    </Anchor>
                </Text>
                &nbsp;
                <Text>
                    Create a table of reps that includes the following columns: First Name, Last Name, Email, Team, Total Revenue
                </Text>
                &nbsp;
                <Text>
                    Add the following filters: Team Name, Opp Customer
                </Text>
            </Container>
        </Paper>
    );
};

export default LandingPage;
