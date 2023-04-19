package com.portal.core.module.service;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.AddressForm;
import com.portal.core.module.dto.respon.AddressDTO;
import com.portal.core.module.entities.Address;
import com.portal.core.module.entities.User;
import com.portal.core.module.repository.AddressRepository;
import com.portal.core.module.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.List;

@Service
public class AddressService extends CRUDService<Address, AddressForm> {
    static final String MASTER_DATA = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province";
    static final String GHN_TOKEN = "c26fbc83-124e-11ed-b136-06951b6b7f89";
    @Autowired
    private AddressRepository addressRepository;

    @Override
    public CRUDDao<Address, Long> getBaseDao() {
        return addressRepository;
    }

    @Override
    public DataTableResults<Address> getDataTables(AddressForm form) {
        return addressRepository.getDatatables(filterData, form);
    }

    @Autowired
    UserRepository userRepository;

    @Override
    protected void validateBeforeSave(Address entity, AddressForm form) throws ValidateException {
        User user = userRepository.findById(form.getUserId()).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "User không tồn tại"));
        if (form.getIsDefault()) { // nếu đặt địa chỉ mới làm mặc định1
            // Bỏ mặc định địa chỉ cũ
            addressRepository.updateAddressDefault(filterData, user.getId());
        }
    }

    @Override
    protected void customBeforeSave(Address entity, AddressForm form) throws ValidateException {
        User user = userRepository.findById(form.getUserId()).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "User không tồn tại"));
        entity.setUser(user);

    }

    public List<AddressDTO> findAllByUser(User user) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.setAccept(Arrays.asList(new MediaType[] { MediaType.APPLICATION_JSON }));
//        // Yêu cầu trả về định dạng JSON
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.set("Authorization", GHN_TOKEN);
//        headers.set("Token", GHN_TOKEN);
//        headers.set("ShopId", "117267");
//        // HttpEntity<String>: To get result as String.
//        HttpEntity<String> entity = new HttpEntity<String>(headers);
//        // RestTemplate
//        RestTemplate restTemplate = new RestTemplate();
//
//        // Gửi yêu cầu với phương thức GET, và các thông tin Headers.
//        ResponseEntity<String> response = restTemplate.exchange(MASTER_DATA, HttpMethod.GET, entity, String.class);
//
//        String result = response.getBody();
//        System.out.println(result);

        return addressRepository.findAllByUserLogin(filterData, user.getId());
    }
    public List<Address> findAllByUser(Long idUser) {
        try {
            User user = userRepository.findById(idUser).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "User không tồn tại"));
            return addressRepository.findAllByUser(user);
        } catch (Exception | ValidateException e ) {
            e.printStackTrace();
            return null;
        }
    }

}
