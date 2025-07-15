"use client";

import React, { useState } from "react";
import PageTitle from "@/components/page-title";
import { useGetMyPases } from "@/hooks/useGetMyPases";
import PasesEntradaTable from "@/components/table/pases-entrada/table";
import PaginationPases from "@/components/pages/pases/PaginationPases";

const ListaPasesPage = () => {
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);
  const [searchName, setSearchName] = useState("");

  const { data, isLoading } = useGetMyPases({ skip, limit, searchName });
  const { records, actual_page, records_on_page, total_pages, total_records } = data || {};

  const handlePageChange = (newSkip: number, newLimit: number) => {
    setSkip(newSkip);
    setLimit(newLimit);
  };

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="p-6 space-y-6 w-full mx-auto">
          <PageTitle title="Historial De Pases De Entrada" />
          <PasesEntradaTable isLoading={isLoading} pases={records ?? []} onSearch={setSearchName} />
          {!isLoading && (
            <PaginationPases
              actual_page={actual_page}
              records_on_page={records_on_page}
              total_pages={total_pages}
              total_records={total_records}
              limit={limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaPasesPage;
