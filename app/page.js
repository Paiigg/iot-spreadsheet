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
import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import Grafik from "@/components/Grafik";
import TempCard from "@/components/TempCard";
import { Skeleton } from "@/components/ui/skeleton";

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

async function getData() {
  const res = await fetch("/api/sheets", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Home() {
  const [testData, setTestData] = useState([]);
  const [testAllData, setTestAllData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setWarningMessage } = useWarningContext();
  const [show, setShow] = useState(false);
  const { isLoaded, userId } = useAuth();

  const { push } = useRouter();
  // In case the user signs out while on the page.
  // if (!isLoaded || !userId) {
  //   push("/sign-in");
  // }

  const handleModal = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (!isLoaded || !userId) {
      push("/sign-in");
    }

    const fetchData = async () => {
      setLoading(true);
      const mesinRef = ref(database, "mesin");
      await get(mesinRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const mesinArray = Object.entries(snapshot.val()).map(
              ([id, data]) => ({
                id,
                ...data,
                timestamp: new Date().toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                }),
              })
            );
            setLatestData(mesinArray);
            setAllData((prevWarnings) => {
              // Gabungkan data baru dengan data sebelumnya
              const updatedMessages = [...prevWarnings, ...mesinArray];

              // Ambil hanya 8 data terbaru
              const slicedMessages = updatedMessages.slice(-8);

              return slicedMessages;
            });
            mesinArray.forEach((data) => {
              //         console.log(data);
              if (data.celcius >= 34) {
                const warning = {
                  id: uuidv4(),
                  timestamp: new Date().toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                  }),
                  pesan: `Mesin ${data.id} terlalu panas! Suhu mencapai ${data.celcius} °C yang melebihi ambang batas!`,
                };

                setWarningMessage((prevWarnings) => [...prevWarnings, warning]);
                setShow(true);
              }
            });
            setLoading(false);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.log({ error });
        });
    };

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clean up interval on component unmount or when testData changes
    return () => clearInterval(interval);
  }, [testData]);

  // useEffect(() => {
  //   if (!isLoaded || !userId) {
  //     push("/sign-in");
  //   }
  //   const fetchData = async () => {
  //     try {
  //       const result = await getData();
  //       console.log({ result });
  //       // Update allData dengan data_logger
  //       setAllData(result.data_logger.reverse());

  //       // Update latestData sesuai id mesin
  //       setLatestData(result.latest_data_logger);

  //       result.latest_data_logger.forEach((data) => {
  //         console.log(data);
  //         if (data.celcius >= 33) {
  //           const warning = {
  //             id: uuidv4(),
  //             timestamp: new Date().toLocaleString("id-ID", {
  //               timeZone: "Asia/Jakarta",
  //             }),
  //             pesan: `Mesin ${data.id} terlalu panas! Suhu mencapai ${data.celcius} °C yang melebihi ambang batas!`,
  //           };

  //           setWarningMessage((prevWarnings) => [...prevWarnings, warning]);
  //           setShow(true);
  //         }
  //       });
  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   };

  //   fetchData();

  // }, [latestData, allData]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }
  // console.log({ allData });
  console.log({ latestData });
  console.log({ testData });
  console.log({ testAllData });
  return (
    <main className="p-10">
      <div>
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm">Monitoring suhu</p>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-4 lg:grid-cols-2">
        {latestData?.map((data, index) => (
          <Card key={index} className="p-4 mb-4 text-center lg:text-left">
            <CardHeader>
              <CardTitle>{`Suhu Mesin ${data.id}`}</CardTitle>
              <CardDescription>Updated at : {data.timestamp}</CardDescription>
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
      <TempCard latestData={latestData} loading={loading} />
      <Grafik latestData={latestData} allData={allData} loading={loading} />
      <Dialog show={show} setShow={setShow} handleModal={handleModal} />
    </main>
  );
}
