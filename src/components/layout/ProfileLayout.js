"use client";

import { Container, Grid, GridItem } from "@chakra-ui/react";
import ProfileSidebar from "../profile/ProfileSidebar";
export default function ProfileLayout({ children }) {
  return (
    <Container maxW="container.xl" py={5}>
      <Grid
        templateColumns={{ base: "1fr", md: "250px 1fr" }}
        gap={6}
        marginTop={5}
      >
        <GridItem as="nav">
          <ProfileSidebar />
        </GridItem>

        <GridItem>{children}</GridItem>
      </Grid>
    </Container>
  );
}
