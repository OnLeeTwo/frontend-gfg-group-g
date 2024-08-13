import {
    Image,
    Stack,
    Heading,
    Card,
    ButtonGroup,
    Divider,
    Button,
    Text,
    CardBody,
    CardFooter
} from '@chakra-ui/react'

export default function MarketCard({ name, description, image, market, price, stock }) {
    return (
        <Card maxW='sm' variant="filled">
            <CardBody>
                <Image
                    src={image}
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>{name}</Heading>
                    <Heading as='h4' size='md'>
                        {market}
                    </Heading>
                    <Text>
                        {description}
                        {
                            stock < 5 ? <p>Stock hampir habis</p> : <></>
                        }
                    </Text>
                    <Text color='blue.600' fontSize='2xl'>
                        {price}
                    </Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <ButtonGroup spacing='2'>
                    <Button variant='solid' colorScheme='blue'>
                        View Product
                    </Button>
                    <Button variant='ghost' colorScheme='blue'>
                        add to cart
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}