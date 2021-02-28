import { LightningElement, wire,track, api} from 'lwc';
import lwcDataCacheableTrue from '@salesforce/apex/GetApexData.lwcDataCacheableTrue';
import lwcData from '@salesforce/apex/GetApexData.lwcData';
import deleteAssetAndLiability from '@salesforce/apex/GetApexData.deleteAssetAndLiability';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';




const columns = [
    { label: 'Type', fieldName: 'Type__c'},
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Balance', fieldName: 'Balance__c', type: 'number' },
];


export default class AssetLiabilityComp extends LightningElement {

    columns = columns;
    @track dataToDisplay;
    @track totalToDisplay={};
    
    // @wire(lwcDataCacheableTrue) 
    // dataFromOrg({error, data}){
    //     if(data){
    //            this.dataToDisplay = data.assetAndLiabilities;
    //            this.totalToDisplay.totalAssets = data.totalAssets;
    //            this.totalToDisplay.totalLiabilities = data.totalLiabilities;
    //            this.totalToDisplay.netWorth = data.netWorth;
    //     }
    //     //DIsplay Error Message     
    // } 
    
    setDisplayData(data) {
        this.dataToDisplay = data.assetAndLiabilities;
        this.totalToDisplay.totalAssets = data.totalAssets;
        this.totalToDisplay.totalLiabilities = data.totalLiabilities;
        this.totalToDisplay.netWorth = data.netWorth;
    }
    
        showErrorToast(message) {
            const evt = new ShowToastEvent({
                title: 'Error:',
                message: message,
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }

        showSuccessToast(message) {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: message,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
}
    connectedCallback(){
        this.dataFromOrgImperative();
    }
      // Imperatively call lwcData() Apex method to pass data from org to LWC
     dataFromOrgImperative(){
       lwcData()
       .then(data => {
            this.setDisplayData(data);
        })
        .catch(error => {
            this.showErrorToast('Contact your Administrator');
       });
   }
        
     //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    @track isModalOpen = false;
    openModal() {
    // to open modal set isModalOpen track value as true
        this.isModalOpen = true;
    }
    closeModal() {
    // to close modal set isModalOpen track value as false
        this.isModalOpen = false;
        this.dataFromOrgImperative();
    }
        
        
    handleSubmit(event){
        event.detail.fields;
        this.template.querySelector('lightning-record-edit-form').submit();
        this.handleReset();
         this.showSuccessToast('Record Created');
    }


    handleReset() {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
            if (inputFields) {
                inputFields.forEach(field => {
                    field.reset();
                });
            }
    }
    @track selectedRows=[];
    getSelectedRows(event){
        this.selectedRows = event.detail.selectedRows;
    }

    handleDelete(event){
        if(this.selectedRows.length>0){
            this.deleteRows();
        }else{
            this.showErrorToast('No record Selected');
        }
        
    }
    // Imperatively call deleteAssetAndLiability() Apex method and passing selected rows as parameter
    deleteRows(){
        deleteAssetAndLiability({listOfAssetAndLiability:this.selectedRows})
        .then(data => {
            this.setDisplayData(data);
            this.template.querySelector('lightning-datatable').selectedRows=[]; //Clears selected rows in LWC lightning data table after table refresh
            this.showSuccessToast('Record Deleted');
            
        })
        .catch(error => {
            this.showErrorToast('Error deleting your record');
       });
    }
    

}