import React from 'react';
import { Paper, Container, Text, Title } from '@mantine/core';

const LandingPage = () => {
    return (
        <Paper shadow="md" p="xl">
            <Container size="md">
                <Title order={1}>Good luck!</Title>
                <Text>
                    Please refer to read me or reach out with any questions
                </Text>
            </Container>
        </Paper>
    );
};

export default LandingPage;
