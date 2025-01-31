//@ts-nocheck
import React from 'react'
import { useState, useEffect } from "react";
import sendMessage from "../../utils/messages";
import { useSocket } from "../../utils/socketContext";
import ChangeTableButton from "../changeTableButton/changeTableButton";
import SkeletonTable from '../SkeletonTable';

function Filter() {
  
  return <SkeletonTable />
}

export default Filter
