package com.portal.core.common.result;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseFile {
    private String uuid;
    private String name;
    private String url;
    private String type;
    private long size;
//    public ResponseFile(String uuid, String name, String url, String type, long size) {
//        this.uuid = uuid;
//        this.name = name;
//        this.url = url;
//        this.type = type;
//        this.size = size;
//    }
//    public String getName() {
//        return name;
//    }
//    public void setName(String name) {
//        this.name = name;
//    }
//    public String getUrl() {
//        return url;
//    }
//    public void setUrl(String url) {
//        this.url = url;
//    }
//    public String getType() {
//        return type;
//    }
//    public void setType(String type) {
//        this.type = type;
//    }
//    public long getSize() {
//        return size;
//    }
//    public void setSize(long size) {
//        this.size = size;
//    }
}
