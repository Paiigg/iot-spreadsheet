"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TempCard = ({ latestData, loading }) => {
  return (
    <div className="grid grid-cols-1 gap-2 mt-4 lg:grid-cols-2">
      {latestData?.map((data, index) => (
        <Card key={index} className="p-4 mb-4 text-center lg:text-left">
          <CardHeader>
            <CardTitle>{`Suhu Mesin ${data.id}`}</CardTitle>
            <CardDescription>
              Updated at : {data.date} - {data.time}
            </CardDescription>
          </CardHeader>
          <Card className="flex flex-col items-center justify-between mb-2 lg:flex-row">
            <CardHeader>
              <CardTitle>Suhu Celcius</CardTitle>
              <CardDescription>description</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 text-4xl font-semibold lg:pb-0 text-primary">
              {data.celcius ? (
                <span>{data.celcius} °C</span>
              ) : (
                <span>XX.XX °C</span>
              )}
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center justify-between mb-2 lg:flex-row">
            <CardHeader>
              <CardTitle>Suhu Fahrenheit</CardTitle>
              <CardDescription>description</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 text-4xl font-semibold lg:pb-0 text-primary">
              {data.fahrenheit ? (
                <span>{data.fahrenheit} °F</span>
              ) : (
                <span>XX.XX °F</span>
              )}
            </CardContent>
          </Card>
        </Card>
      ))}
    </div>
  );
};

export default TempCard;
