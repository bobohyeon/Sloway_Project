package com.sloway.app.payment.settlement.account.service;


import com.sloway.app.common.exception.CustomException;
import com.sloway.app.host.common.HostErrorCode;
import com.sloway.app.host.entity.HostEntity;
import com.sloway.app.host.repository.HostRepository;
import com.sloway.app.payment.settlement.account.dto.request.AccountCreateReqDto;
import com.sloway.app.payment.settlement.account.dto.response.AccountResDto;
import com.sloway.app.payment.settlement.account.entity.AccountEntity;
import com.sloway.app.payment.settlement.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;
    private final HostRepository hostRepository;

    @Transactional
    public AccountResDto registerAccount(Long memberNo,AccountCreateReqDto reqDto) {
        HostEntity hostEntity = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
        AccountEntity accountEntity = accountRepository.findByHostNo(hostEntity.getNo());

        if (accountEntity != null) {
            accountEntity.updateAccount(reqDto.getBankName(), reqDto.getAccountNo(), reqDto.getHolder());
            return AccountResDto.from(accountEntity);
        } else {
            return AccountResDto.from(accountRepository.save(reqDto.toEntity(hostEntity)));
        }
    }

    public AccountResDto findAccountByHostNo(Long memberNo) {
        HostEntity hostEntity = hostRepository.findByMemberNo(memberNo)
                .orElseThrow(() -> new CustomException(HostErrorCode.HOST_NOT_FOUND));
        AccountEntity accountEntity = accountRepository.findByHostNo(hostEntity.getNo());
        if (accountEntity == null) return null;
        return AccountResDto.from(accountEntity);
    }
}


