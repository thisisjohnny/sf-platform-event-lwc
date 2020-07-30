import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

export default class EventApiListener extends LightningElement {
    channelName = '/event/Test__e';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;

    subscription = {};

    handleChannelName(event) {
        this.channelName = event.target.value;
    }

    connectedCallback() {
        this.registerErrorListener();
    }

    handleSubscribe() {
        let that = this;
        const messageCallback = function(response) {
            console.log('New message received: ', JSON.stringify(response));
            let obj = JSON.parse(response);
            let myTitle = 'New Event';
            let myMessage = obj.data.payload.My_Value__c;
            that.showToast(myTitle, myMessage);
        };

        subscribe(this.channelName, -1, messageCallback).then(response => {
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
            this.toggleSubscribeButton(true);
        });
    }

    handleUnsubscribe() {
        this.toggleSubscribeButton(false);
        
        unsubscribe(this.subscription, response => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
        });
    }

    toggleSubscribeButton(enableSubscribe) {
        this.isSubscribeDisabled = enableSubscribe;
        this.isUnsubscribeDisabled = !enableSubscribe;
    }

    registerErrorListener() {
        onError(error => {
            console.log('Recieved error from server: ', JSON.stringify(error));
        });
    }

    showToast(toastTitle, toastMessage) {
        const event = new ShowToastEvent({
            title: toastTitle,
            message: toastMessage
        });
        this.dispatchEvent(event);
    }

    testToast() {
        let title = 'Today is Thursday';
        let message = 'The current time is 9:31am';
        
        this.showToast(title, message);
    }
}