/**
 * Name: GetApexData
 * Description: This Apex class contains methods that gets Assets and Liabilities data from the Org,
 * contains methods that deletes selected records fron the Org and datatable, contains method
 * Author: Opeyemi Adetola
 * Date: 02/28/2021
 * 
 */
public without sharing class GetApexData {
     public static List<Asset_and_Liability__c> getAssetAndLiabilityRecords(){
        List<Asset_and_Liability__c> myList = new List<Asset_and_Liability__c>();
         myList =  [SELECT Id, Name, Type__c, Balance__c FROM Asset_and_Liability__c];
         return myList;
    }
    //Data to be wired into AssetLiabilityComp
    @AuraEnabled(cacheable=true)    
    public static LwcData lwcDataCacheableTrue(){
      return lwcData();
    }
    @AuraEnabled
    public static LwcData deleteAssetAndLiability (List<Asset_and_Liability__c> listOfAssetAndLiability){
        delete listOfAssetAndLiability;
        return lwcData();
    }
   
    @AuraEnabled
    public static LwcData lwcData() {
        List<Asset_and_Liability__c> aAndL = getAssetAndLiabilityRecords();
        LwcData lwc = new LwcData(aAndL);
        return lwc;
    }
        //Inner Class
    public class LwcData{
        @AuraEnabled
        public list<Asset_and_Liability__c> assetAndLiabilities;
        @AuraEnabled
        public Integer totalAssets;
        @AuraEnabled
        public Integer totalLiabilities;
        @AuraEnabled
        public Integer netWorth;

        public LwcData(list<Asset_and_Liability__c> assetAndLiabilities){
            this.assetAndLiabilities = assetAndLiabilities;
            this.totalAssets = calculateTotal(assetAndLiabilities,'Asset');
            this.totalLiabilities=calculateTotal(assetAndLiabilities,'Liability');
            this.netWorth=totalAssets-totalLiabilities;
        }

        public Integer calculateTotal(list<Asset_and_Liability__c> assetAndLiabilities,String type){
            Integer total=0;
            
            for(Asset_and_Liability__c aAndL :assetAndLiabilities){
                if(aAndL.Type__c==type){
                    total+=(Integer) aAndL.Balance__c;
                }
            }
           
            return total;
        }
    }
}
