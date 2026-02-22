package com.alisimsek.LibraryManagementProject.service;

import com.alisimsek.LibraryManagementProject.dto.response.PublisherResponse;
import com.alisimsek.LibraryManagementProject.entity.Publisher;
import com.alisimsek.LibraryManagementProject.mapper.PublisherMapper;
import com.alisimsek.LibraryManagementProject.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PublisherService {

    private final PublisherRepository publisherRepository;
    private final PublisherMapper publisherMapper;

    public List<PublisherResponse> findAll() {
        return publisherMapper.asOutput(publisherRepository.findAll());
    }

    public PublisherResponse getById(Long id) {
        Publisher p = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(id + "id li Yayın Evi Bulunamadı !!!"));
        return publisherMapper.asOutput(p);
    }

    public Publisher create(Publisher request) {

        Optional<Publisher> isPublisherExist = publisherRepository.findByNameAndEstablishmentYear(request.getName(),
                request.getEstablishmentYear());

        if (isPublisherExist.isEmpty()) {
            return publisherRepository.save(request);
        }
        throw new RuntimeException("Bu yayın evi daha önce sisteme kayıt olmuştur !!!");
    }

    public Publisher update(Long id, Publisher request) {
        publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        id + " Güncellemeye çalıştığınız yayın evi sistemde bulunamadı. !!!."));

        Optional<Publisher> isPublisherExist = publisherRepository.findByNameAndEstablishmentYear(request.getName(),
                request.getEstablishmentYear());

        if (isPublisherExist.isPresent() && !isPublisherExist.get().getId().equals(id)) {
            throw new RuntimeException("Bu yayın evi farklı bir ID ile daha önce sisteme kayıt olmuştur !!!");
        }

        request.setId(id);
        return publisherRepository.save(request);
    }

    public void deleteById(Long id) {
        Optional<Publisher> publisherFromDb = publisherRepository.findById(id);
        if (publisherFromDb.isPresent()) {
            publisherRepository.delete(publisherFromDb.get());
        } else {
            throw new RuntimeException(id + "id li Yayın Evi sistemde bulunamadı !!!");
        }
    }
}