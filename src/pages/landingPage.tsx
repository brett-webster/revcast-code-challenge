import React from 'react';
import { Paper, Container, Text, Title, Anchor } from '@mantine/core';

const LandingPage = () => {
    return (
        <Paper shadow="md" p="xl">
            <Container size="md">
                <Title order={1}>Good luck!</Title>
                <Text>
                    Please refer to read me or reach out with any questions
                </Text>
                <Text>
                    It is recomended to use the Mantine Components&nbsp;&nbsp;
                    <Anchor href="https://mantine.dev/" target="_blank">
                        Mantine docs
                    </Anchor>
                </Text>
            </Container>
        </Paper>
    );
};

export default LandingPage;
