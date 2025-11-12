"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function Calendar(props: any) {
  return (
    <DayPicker
      showOutsideDays
      {...props}
    />
  );
}


