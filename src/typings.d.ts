
/*******************************************************************************
 * Copyright IBM Corp. 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
	id: string;
}

declare module '*.json' {
	const value: any;
	export default value;
}

declare function cmSetOptOut(value: string): any;
declare function cmSetClientID(clientIds: string, dataCollectionMethod: boolean, dataCollectionDomain: string, cookieDomain: string): any;
declare function readDDXObject(): any;
declare function cmSetupOther({}: any): any;
declare function cmSetupNormalization(param: string): any;
declare function cmCreateManualImpressionTag(pageId: string, departmentInitiative: string, revisionArea: string, campaignReport: string, marketingExperimentation: string): any;
declare function ciHandshake(pageContext): any;
declare var digitalData: any;
declare var IORequest: any;
