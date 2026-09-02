import DashboardTabs
    from "../../../../../components/common/DashboardTabs/DashboardTabs";

function CashierTabs({
                         activeTab,
                         onTabChange,
                         tableCount,
                         orderCount,
                         readyItemCount = 0,
                     }) {
    return (
        <DashboardTabs
            activeTab={activeTab}
            onTabChange={onTabChange}
            tabs={[
                {
                    id: "tables",
                    label: "Phòng Bàn",
                    count: tableCount,
                },
                {
                    id: "orders",
                    label: "Đơn Hàng",
                    count: orderCount,
                    notification:
                        readyItemCount > 0,
                },
            ]}
        />
    );
}

export default CashierTabs;