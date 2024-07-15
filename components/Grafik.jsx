"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const Grafik = ({ latestData, allData }) => {
  const chartConfig = {
    celcius: {
      label: "Celcius",
      color: "#FB607F",
    },
    fahrenheit: {
      label: "Fahrenheit",
      color: "#FB607F",
    },
  };

  return (
    <div className="grid grid-cols-1 gap-2 mt-4 text-center lg:grid-cols-2 lg:text-left">
      {latestData?.map((data) => (
        <Card key={data.id}>
          <CardHeader>
            <CardTitle>{`Grafik Mesin ${data.id}`}</CardTitle>
            <CardDescription>
              Updated at : {data.date} - {data.time}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={allData.filter((msg) => msg.id === data.id).slice(-8)}
                margin={{
                  left: 20,
                  right: 20,
                  top: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="lastUpdated"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="celcius"
                  type="natural"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{
                    fill: "hsl(var(--primary))",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
                <Line
                  dataKey="fahrenheit"
                  type="natural"
                  stroke={"hsl(var(--primary))"}
                  strokeWidth={2}
                  dot={{
                    fill: "hsl(var(--primary))",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList
                    position="top"
                    offset={10}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Grafik;
