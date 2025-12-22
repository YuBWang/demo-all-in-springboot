package com.example.dto;

import java.io.Serializable;

public class Compony implements Serializable {
    private static final long serialVersionUID = 1L;
    private String corpbcode;
    private String mdmid;
    private String sourceicode;
    private String sourcecode;
    private String sourcesheetcode;

    public String getCorpbcode() {
        return corpbcode;
    }

    public void setCorpbcode(String corpbcode) {
        this.corpbcode = corpbcode;
    }

    public String getMdmid() {
        return mdmid;
    }

    public void setMdmid(String mdmid) {
        this.mdmid = mdmid;
    }

    public String getSourceicode() {
        return sourceicode;
    }

    public void setSourceicode(String sourceicode) {
        this.sourceicode = sourceicode;
    }

    public String getSourcecode() {
        return sourcecode;
    }

    public void setSourcecode(String sourcecode) {
        this.sourcecode = sourcecode;
    }

    public String getSourcesheetcode() {
        return sourcesheetcode;
    }

    public void setSourcesheetcode(String sourcesheetcode) {
        this.sourcesheetcode = sourcesheetcode;
    }
}
