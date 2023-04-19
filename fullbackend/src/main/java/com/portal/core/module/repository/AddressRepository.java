package com.portal.core.module.repository;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.AddressForm;
import com.portal.core.module.dto.respon.AddressDTO;
import com.portal.core.module.entities.Address;
import com.portal.core.module.entities.User;
import org.hibernate.query.NativeQuery;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;


@Transactional
@Repository
public interface AddressRepository extends CRUDDao<Address, Long> {

    default String buildGetDataQuery(AddressForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,address_detail As addressDetail ";
        nativeSQL += "       ,full_name As fullName     ";
        nativeSQL += "       ,phone_number As phoneNumber  ";
        nativeSQL += "       ,district As district     ";
        nativeSQL += "       ,province As province     ";
        nativeSQL += "       ,ward As ward         ";
        nativeSQL += "       FROM address ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getAddressDetail(), strCondition, paramList, "address_detail");
        CommonUtils.filter(form.getFullName(), strCondition, paramList, "full_name");
        CommonUtils.filter(form.getPhoneNumber(), strCondition, paramList, "phone_number");
        CommonUtils.filter(form.getDistrict(), strCondition, paramList, "district");
        CommonUtils.filter(form.getProvince(), strCondition, paramList, "province");
        CommonUtils.filter(form.getWard(), strCondition, paramList, "ward");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    default String buildQueryGetAddressByUser(Long idUser, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,address_detail As addressDetail ";
        nativeSQL += "       ,address_full As addressFull ";
        nativeSQL += "       ,full_name As fullName     ";
        nativeSQL += "       ,phone_number As phoneNumber  ";
        nativeSQL += "       ,district As district     ";
        nativeSQL += "       ,province As province     ";
        nativeSQL += "       ,is_default As isDefault     ";
        nativeSQL += "       ,ward As ward         ";
        nativeSQL += "       FROM address ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        if(idUser != null) {
            strCondition.append( "AND address.user_id = ?");
            paramList.add(idUser);
        }
        return nativeSQL + strCondition.toString() + orderBy;
    }

    default DataTableResults<Address> getDatatables(FilterData filterData, AddressForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Address.class);
    }

    /**
     * Query lấy danh sách địa chỉ theo user login
     * @param filterData
     * @param form
     * @return
     */
    default List<AddressDTO> findAllByUserLogin(FilterData filterData, Long idUser ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildQueryGetAddressByUser(idUser, paramList);
        return filterData.list(nativeQuery, paramList, AddressDTO.class);
    }

    @Modifying
    @Query("delete from Address u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    public List<Address> findAllByUser(User user);

    default void updateAddressDefault(FilterData filterData, Long idUser) {
        String sql = "UPDATE address a Set a.is_default = 0 WHERE a.user_id = ?";
        NativeQuery query = filterData.createNativeQuery(sql);
        query.setParameter(1, idUser);
        query.executeUpdate();
        filterData.flushSession();
    }
}
