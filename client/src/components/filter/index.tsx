//@ts-nocheck
import React from 'react'
import { useState, useEffect } from "react";
import sendMessage from "../../contexts/SocketContext/messages";
import { useSocket } from "../../contexts/SocketContext/socketContext";
import ChangeTableButton from "../ChainButtons";
import SkeletonTable from '../SkeletonTable';

function Filter() {
  
  return <SkeletonTable />
}

export default Filter
