import {
    Image,
    Stack,
    Heading,
    Card,
    CardHeader,
    ButtonGroup,
    Button,
    Text,
    CardBody,
    CardFooter,
    Divider
} from '@chakra-ui/react'

import {
    Image,
    Container,
    Input,
    InputRightAddon,
    Stack,
    Heading,
    Card,
    CardHeader,
    Grid,
    ButtonGroup,
    Button,
    Text,

    Flex,
    Box,
    InputGroup,
    InputLeftElement
} from '@chakra-ui/react'
import MarketCard from '@/components/MarketCard'


export default function Market() {


    return (
        <Container maxW="container.xl" py={10}>
            <Flex direction={{ base: "column", md: "column" }} gap={3}>
                <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                    <InputGroup borderRadius={5} size='sm'>
                        <InputLeftElement
                            pointerEvents="none"
                        />
                        <Input type="text" placeholder="Search..." border="1px solid #949494" />
                        <InputRightAddon
                            border="none"
                        >
                            <Button size="sm" borderLeftRadius={0} borderRightRadius={3.3} border="1px solid #949494">
                                Search
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                </Text>
                </Box>
                <Box>
                <Grid templateColumns='repeat(3, 1fr)' gap={6}>
                    {['Product 1', 'product 2'].map((products) => (
                    <div  key={products}>
                       <MarketCard
                        name="Market satu"
                        image='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                        description="Ini deskripsi market"
                        location="Jakarta"
                        />
                    </div>
                ))}
                    </Grid>
                </Box>
            </Flex>


        </Container>
    )
}
