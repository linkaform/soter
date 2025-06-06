import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import React from "react";

interface PaginationPasesProps {
    actual_page: number;
    records_on_page: number;
    total_pages: number;
    total_records: number;
    limit: number;
    onPageChange: (skip: number, limit: number) => void;
}

const LIMIT_OPTIONS = [10, 50, 100];

const PaginationPases: React.FC<PaginationPasesProps> = ({
    actual_page,
    records_on_page,
    total_pages,
    total_records,
    limit,
    onPageChange,
}) => {
    const handlePageChange = (page: number) => {
        const skip = (page - 1) * limit;
        onPageChange(skip, limit);
    };

    const handleLimitChange = (value: string) => {
        const newLimit = Number(value);
        onPageChange(0, newLimit);
    };

    return (
        <div className="flex items-center gap-4 w-full justify-between border rounded-md p-3">
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-500">
                    &nbsp;Registros por página&nbsp;
                    <Select onValueChange={handleLimitChange} value={limit.toString()}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Por página" />
                        </SelectTrigger>
                        <SelectContent>
                            {LIMIT_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt.toString()}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </label>
                <span className="text-gray-500">
                    1 - {records_on_page} de {total_records} registros
                </span>
            </div>
            <div className="flex items-center gap-5">
                <Button
                    onClick={() => handlePageChange(actual_page - 1)}
                    disabled={actual_page <= 1}
                    className={actual_page <= 1 ? "bg-gray-500" : ""}
                >
                    Anterior
                </Button>
                <span>
                    Página {actual_page} de {total_pages}
                </span>
                <Button
                    onClick={() => handlePageChange(actual_page + 1)}
                    disabled={actual_page >= total_pages}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
};

export default PaginationPases;