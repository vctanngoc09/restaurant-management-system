package vn.edu.ut.resto.dto.response;

import java.util.List;


public class ChefBoardResponse {


    private List<KitchenTicketResponse> waiting;

    private List<KitchenTicketResponse> processing;

    private List<KitchenTicketResponse> ready;


    public ChefBoardResponse() {
    }


    public ChefBoardResponse(
            List<KitchenTicketResponse> waiting,
            List<KitchenTicketResponse> processing,
            List<KitchenTicketResponse> ready
    ) {

        this.waiting = waiting;
        this.processing = processing;
        this.ready = ready;
    }


    public List<KitchenTicketResponse> getWaiting() {
        return waiting;
    }


    public void setWaiting(
            List<KitchenTicketResponse> waiting
    ) {
        this.waiting = waiting;
    }


    public List<KitchenTicketResponse> getProcessing() {
        return processing;
    }


    public void setProcessing(
            List<KitchenTicketResponse> processing
    ) {
        this.processing = processing;
    }


    public List<KitchenTicketResponse> getReady() {
        return ready;
    }


    public void setReady(
            List<KitchenTicketResponse> ready
    ) {
        this.ready = ready;
    }
}