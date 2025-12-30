package com.example.mqusage.dto.params;

import java.io.Serializable;

public class CompanyRequestparams implements Serializable {

    private static final long serialVersionUID = 1L;
    private String companyid;

    public String getCompanyid() {
        return companyid;
    }

    public void setCompanyid(String companyid) {
        this.companyid = companyid;
    }

    public String getCcode() {
        return ccode;
    }

    public void setCcode(String ccode) {
        this.ccode = ccode;
    }

    private String ccode;



}
