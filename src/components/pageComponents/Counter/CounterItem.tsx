"use client";
import { useState, useEffect } from "react";
import useCounter from "@/hooks/useCounter";

interface CounterItemsProps {
  end: number;
  label:string;
  symbol?:string;
  duration?:number;
}

const CounterItem = ({ end, label, symbol, duration = 2000 }:CounterItemsProps) => {
  const count = useCounter(end, duration);

  return (
    <div>
      <h3 className="text-4xl text-center font-bold">{count}{symbol}</h3>
      <p className="text-center">{label}</p>
    </div>
  );
};

export default CounterItem;
