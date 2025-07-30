"use client";
import { useClient } from '@/context/ClientContext';
import { DashboardContent } from '@/components';

export default function DashboardPage() {
  const { clientName } = useClient();
  return <DashboardContent clientName={clientName} />;
}
