// app/context/ClientContext.tsx
"use client";
import { createContext, useContext } from 'react';

const ClientContext = createContext({ clientName: 'John Anderson' });

export const useClient = () => useContext(ClientContext);
export default ClientContext;