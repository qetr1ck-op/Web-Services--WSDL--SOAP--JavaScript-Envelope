//object with value which we need to create SOAP request;
var vRequestObj = $soap.createRequest('urn:Webservices' + 'PortalEmags', 'connect', {
    "username": $soap.createField("string", "op@papeer.com"),
    "password": $soap.createField("string", "12op34")
});

//now it's time to create XML string;
var vRequestXMLString = $xml.toString(vRequestObj);

function successCallback(pXML) {
    var vData = $soap.getResponseNode('PortalEmags', $xml.toJSONObject(pXML), 'connect');

    if (vData) {
        return console.log($soap.getFieldValue(vData, ''));
    } else {
        vData = $soap.getErrorNode($xml.toJSONObject(pXML), 'connect');
        return console.log($soap.getFieldValue(vData, 'description'));
    }

}

function failCallback(pMsg) {
    alert('cSOAPClient.getAppData error: ' + pMsg);
}

$get('http://api.portal.emagstudio.com/API/mobileAPI.php?t=WebservicesPortalEmags&wsdl',
    successCallback,
    failCallback,
    '<?xml version="1.0" encoding="utf-8"?>' + vRequestXMLString,
    true, 'post'
);

//XMLHttReequest Helper
function $get(url, success, error, params, isXML, method) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 0) {
            if (success) success(xhr['response' + (isXML ? 'XML' : 'Text')]);
        } else {
            if (error) error(xhr.status);
        }
    };
    xhr.open(method || (isXML ? "post" : "get"), url, success);
    if (isXML)
        xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send(function() {
        if (isXML)
            return params;
        else {
            var result = "?";
            for (var key in params)
                result += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);

            return (params ? result : params);
        }
    }());

    return (success ? true : xhr.responseText);
}