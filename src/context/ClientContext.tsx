"use client";
import { createContext, useContext, ReactNode } from 'react';

export interface ClientContextValue {
  clientName: string;
}

const ClientContext = createContext<ClientContextValue>({ clientName: '' });

export const useClient = () => useContext(ClientContext);

export function ClientProvider({ clientName, children }: { clientName: string; children: ReactNode }) {
  return <ClientContext.Provider value={{ clientName }}>{children}</ClientContext.Provider>;
}

export default ClientContext;