package vn.edu.ut.resto.dto.response;

public class TableResponse {

    private Long id;
    private String tableNumber;
    private String status;
    private String qrToken;

    private Long areaId;
    private String areaName;

    public TableResponse() {
    }

    public TableResponse(Long id, String tableNumber, String status, String qrToken, Long areaId, String areaName) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.status = status;
        this.qrToken = qrToken;
        this.areaId = areaId;
        this.areaName = areaName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }
}