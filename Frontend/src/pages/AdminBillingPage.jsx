import React from "react";
import { useAdmin } from "../features/admin/hooks/useAdmin";
import BillingTable from "../features/admin/components/templates/BillingTable";

const AdminBillingPage = () => {
    const { invoices, isInvoicesLoading, invoicesError } = useAdmin();

    return (
        <div style={{ padding: "20px" }}>
            <BillingTable
                invoices={invoices}
                isInvoicesLoading={isInvoicesLoading}
                invoicesError={invoicesError}
            />
        </div>
    );
};

export default AdminBillingPage;