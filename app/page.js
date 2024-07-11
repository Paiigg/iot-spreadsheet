"use client";

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
import { useEffect, useState } from "react";
import mqtt from "mqtt";
import Dialog from "@/components/Modal";
import { useWarningContext } from "@/components/context/warning-context";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

let client;

const options = {
  keepalive: 30,
  clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30000,
};

export default function Home() {
  // const [data, setData] = useState({
  //   id: "",
  //   celcius: "",
  //   fahrenheit: "",
  //   lastUpdated: "N/A",
  // });
  // const [receivedMessages, setReceivedMessages] = useState([]);
  const [data, setData] = useState({
    id1: { celcius: "", fahrenheit: "", lastUpdated: "N/A" },
    id2: { celcius: "", fahrenheit: "", lastUpdated: "N/A" },
  });
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [show, setShow] = useState(false);
  const { setWarningMessage, warningMessage } = useWarningContext();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { push } = useRouter();
  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    push("/sign-in");
  }
  const handleModal = () => {
    setShow(!show);
  };

  const chartConfig = {
    celcius: {
      label: "Celcius",
      color: "#FB607F",
    },
    fahrenheit: {
      label: "Farenheit",
      color: "#FB607F",
    },
  };
  // const dataArray = [...data];

  useEffect(() => {
    if (!client) {
      client = mqtt.connect("wss://broker.emqx.io:8084/mqtt", options); // Ganti dengan URL WebSocket broker MQTT Anda
    }

    client.subscribe("plant5/suhu", (err) => {
      if (err) {
        console.error("Subscription error:", err);
      } else {
        console.log("Subscribed to plant5/suhu");
      }
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    client.on("message", (topic, message) => {
      console.log(`Received message: ${message.toString()} on topic: ${topic}`);
      const parsedMessage = JSON.parse(message.toString());
      const newData = {
        id: parsedMessage.id,
        celcius: parseFloat(parsedMessage.celcius).toFixed(1),
        fahrenheit: parseFloat(parsedMessage.fahrenheit).toFixed(1),
        lastUpdated: new Date().toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        }),
      };

      if (newData.celcius >= 34) {
        setShow(true);
        const warning = {
          id: uuidv4(),
          timestamp: newData.lastUpdated,
          pesan: `Mesin ${newData.id} terlalu panas! Suhu mencapai ${newData.celcius} °C yang melebihi ambang batas!`,
        };

        //setWarningMessage((prevMessages) => [...prevMessages, warning]);
        setWarningMessage((prevMessages) => {
          const updatedMessages = [...prevMessages, warning];
          const uniqueWarningMessages = updatedMessages.filter(
            (msg, index, self) => {
              // Filter untuk menghapus data yang duplikat
              return (
                index === self.findIndex((m) => m.timestamp === msg.timestamp)
              );
            }
          );
          return uniqueWarningMessages;
        });
      } else {
        setShow(false);
      }
      console.log({ parsedMessage });
      console.log({ warningMessage });

      //setData(newData);

      // setReceivedMessages((prevMessages) => {
      //   const updatedMessages = [...prevMessages, newData];
      //   const uniqueMessages = updatedMessages
      //     .slice(-8) // Ambil hanya 8 data terakhir
      //     .filter((msg, index, self) => {
      //       // Filter untuk menghapus data yang duplikat
      //       return (
      //         index ===
      //         self.findIndex(
      //           (m) =>
      //             m.celcius === msg.celcius &&
      //             m.fahrenheit === msg.fahrenheit &&
      //             m.lastUpdated === msg.lastUpdated
      //         )
      //       );
      //     });
      //   return uniqueMessages;
      // });
      const idKey = parsedMessage.id === 1 ? "id1" : "id2";
      setData((prevData) => ({
        ...prevData,
        [idKey]: newData,
      }));

      setReceivedMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages,
          { id: parsedMessage.id, ...newData },
        ];
        const uniqueMessages = updatedMessages
          .slice(-8) // Keep only the last 8 messages
          .filter((msg, index, self) => {
            return (
              index ===
              self.findIndex(
                (m) =>
                  m.id === msg.id &&
                  m.celcius === msg.celcius &&
                  m.fahrenheit === msg.fahrenheit &&
                  m.lastUpdated === msg.lastUpdated
              )
            );
          });
        return uniqueMessages;
      });
    });

    client.on("error", (err) => {
      console.error("Connection error:", err);
    });

    client.on("offline", () => {
      console.log("MQTT client offline");
    });

    client.on("reconnect", () => {
      console.log("Reconnecting to MQTT broker");
    });

    client.on("close", () => {
      console.log("MQTT connection closed");
    });
  }, [data]);

  return (
    <main className="p-10">
      <div>
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm">Monitoring suhu</p>
      </div>
      <div className="grid grid-cols-1 gap-2 mt-4 lg:grid-cols-2">
        <Card className="p-4 mb-4 text-center lg:text-left">
          <CardHeader>
            <CardTitle>Suhu Mesin 1</CardTitle>
            <CardDescription>
              Updated at : {data.id1.lastUpdated}
            </CardDescription>
          </CardHeader>
          <Card className="flex flex-col items-center justify-between mb-2 lg:flex-row">
            <CardHeader>
              <CardTitle>Suhu Celcius</CardTitle>
              <CardDescription>description</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 text-5xl font-semibold lg:pb-0 text-primary">
              {data.id1.celcius ? (
                <span>{data.id1.celcius} °C</span>
              ) : (
                <span>NaN °C</span>
              )}
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center justify-between mb-2 lg:flex-row">
            <CardHeader>
              <CardTitle>Suhu Farenheit</CardTitle>
              <CardDescription>description</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 text-5xl font-semibold lg:pb-0 text-primary">
              {data.id1.fahrenheit ? (
                <span>{data.id1.fahrenheit} °F</span>
              ) : (
                <span>NaN °F</span>
              )}
            </CardContent>
          </Card>
        </Card>
        <Card className="p-4 mb-4 text-center lg:text-left">
          <CardHeader>
            <CardTitle>Suhu Mesin 2</CardTitle>
            <CardDescription>
              Updated at : {data.id2.lastUpdated}
            </CardDescription>
          </CardHeader>
          <Card className="flex flex-col items-center justify-between mb-2 lg:flex-row">
            <CardHeader>
              <CardTitle>Suhu Celcius</CardTitle>
              <CardDescription>description</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 text-5xl font-semibold lg:pb-0 text-primary">
              {data.id2.celcius ? (
                <span>{data.id2.celcius} °C</span>
              ) : (
                <span>NaN °C</span>
              )}
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center justify-between mb-2 lg:flex-row">
            <CardHeader>
              <CardTitle>Suhu Farenheit</CardTitle>
              <CardDescription>description</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 text-5xl font-semibold lg:pb-0 text-primary">
              {data.id2.fahrenheit ? (
                <span>{data.id2.fahrenheit} °F</span>
              ) : (
                <span>NaN °F</span>
              )}
            </CardContent>
          </Card>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-2 mt-4 text-center lg:grid-cols-2 lg:text-left">
        <Card>
          <CardHeader>
            <CardTitle>Grafik Mesin 1</CardTitle>
            <CardDescription>
              Updated at : {data.id1.lastUpdated}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={receivedMessages.filter((msg) => msg.id === 1)}
                margin={{
                  left: 12,
                  right: 12,
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
        <Card>
          <CardHeader>
            <CardTitle>Grafik Mesin 2</CardTitle>
            <CardDescription>
              Updated at : {data.id2.lastUpdated}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={receivedMessages.filter((msg) => msg.id === 2)}
                margin={{
                  left: 12,
                  right: 12,
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
                    offset={10}
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
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Dialog show={show} setShow={setShow} handleModal={handleModal} />
    </main>
  );
}
