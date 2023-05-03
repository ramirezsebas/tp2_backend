import { Box, Center } from "@chakra-ui/react";
import React from "react";
import { Bars } from "react-loader-spinner";

export default function SpinnerLoading({ title }: { title: string }) {
  return (
    <Center>
      <h2>{title}</h2>
      <Bars
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </Center>
  );
}
