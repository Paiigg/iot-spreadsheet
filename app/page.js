"use client";

import { useEffect, useState } from "react";
import Dialog from "@/components/Modal";
import { useWarningContext } from "@/components/context/warning-context";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Grafik from "@/components/Grafik";
import TempCard from "@/components/TempCard";

async function getData() {
  const res = await fetch("http://localhost:3000/api/sheets", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Home() {
  const [allData, setAllData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const { setWarningMessage } = useWarningContext();
  const [show, setShow] = useState(false);
  const { isLoaded, userId } = useAuth();

  const { push } = useRouter();

  const handleModal = () => {
    setShow(!show);
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
          if (data.celcius > 34) {
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

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clean up interval on component unmount or when testData changes
    return () => clearInterval(interval);
  }, [latestData, allData]);

  console.log({ allData });
  console.log({ latestData });
  // console.log({ testData });
  // console.log({ testAllData });
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
