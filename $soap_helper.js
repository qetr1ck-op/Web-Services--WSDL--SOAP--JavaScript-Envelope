/**
 * [main module]
 * @return {[object]} [with methods: createRequest, createField, getResponseNode
 * getErrorNode, getFieldValue]
 */
var $soap = function() {
    function getWrappedRequest(pURN, pBody, pHead) {
        var vWR = {
            "soapenv:Envelope": {
                "#attributes": {
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                    "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
                    "xmlns:urn": pURN
                },
                "soapenv:Header": {},
                "soapenv:Body": {}
            }
        };

        if (pHead)
            vWR["soapenv:Envelope"]["soapenv:Header"] = pHead;
        if (pBody)
            vWR["soapenv:Envelope"]["soapenv:Body"] = pBody;

        return vWR;
    }

    function getNode(pNS, pData, pType) {
        return pData["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:Webservices" + pNS + "." + pType + "Response"]["return"];
    }

    return {
        /**
         * [request with xml attributes]
         * @param {[string]} pURN [name of webservice]
         * @param {[strting]} pName [method]
         * @param {[object]} pExt [body data to server]
         * @return {[object]} [JavaScript soap envelope]
         */
        createRequest: function(pURN, pName, pExt) {
            var vSR = {},
                vSRT = (vSR[pURN + "." + pName] = {
                    "#attributes": {
                        "soapenv:encodingStyle": "http://schemas.xmlsoap.org/soap/encoding/"
                    },
                    "return": {
                        "#attributes": {
                            "xsi:type": pName + 'Request'
                        }
                    }
                });

            if (pExt)
                for (var vPrt in pExt)
                    vSRT["return"][vPrt] = pExt[vPrt];

            var vRes = getWrappedRequest(pURN, vSR);
            return vRes;
        },
        /**
         * [create soap field]
         * @param {[string]} pType [type of field]
         * @param {[string/number]} pValue [name of value]
         * @return {[type]} [description]
         */
        createField: function(pType, pValue) {
            var vRes = {
                "#attributes": {
                    "xsi:type": "xsd:" + pType
                },
                "#text": pValue
            };
            return vRes;
        },

        getResponseNode: function(pNS, pData, pType) {
            return getNode(pNS, pData, pType)["response"];
        },

        getErrorNode: function(pNS, pData, pType) {
            return getNode(pNS, pData, pType)["error"];
        },

        getFieldValue: function(pData, pName) {
            return pName ? pData[pName]["#text"] : pData["#text"];
        }
    };
}();