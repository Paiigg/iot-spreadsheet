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
import Grafik from "@/components/Grafik";
import TempCard from "@/components/TempCard";

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
  const res = await fetch("https://iot-dashboard-blue.vercel.app/api/sheets");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Home() {
  // const [data, setData] = useState({
  //   data_logger: [],
  //   latest_data_logger: [],
  // });
  const [allData, setAllData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const { setWarningMessage, warningMessage } = useWarningContext();
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

  useEffect(() => {
    if (!isLoaded || !userId) {
      push("/sign-in");
    }
    const fetchData = async () => {
      try {
        const result = await getData();
        console.log({ result });
        // Update allData dengan data_logger
        setAllData(result.data_logger.reverse());

        // Update latestData sesuai id mesin
        setLatestData(result.latest_data_logger);

        result.latest_data_logger.forEach((data) => {
          console.log(data);
          if (data.celcius >= 33) {
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
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }
  console.log({ allData });
  console.log({ latestData });
  return (
    <main className="p-10">
      <div>
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-sm">Monitoring suhu</p>
      </div>

      <TempCard latestData={latestData} />
      <Grafik latestData={latestData} allData={allData} />
      <Dialog show={show} setShow={setShow} handleModal={handleModal} />
    </main>
  );
}
