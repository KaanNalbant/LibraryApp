package com.alisimsek.LibraryManagementProject.service;

import com.alisimsek.LibraryManagementProject.entity.Book;
import com.alisimsek.LibraryManagementProject.entity.Category;
import com.alisimsek.LibraryManagementProject.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final BookService bookService;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(id + "id li Kategori Bulunamadı !!!"));
    }

    public Category create(Category request) {
        Optional<Category> isCategoryExist = categoryRepository.findByName(request.getName());

        if (isCategoryExist.isEmpty()) {
            return categoryRepository.save(request);
        }
        throw new RuntimeException("Bu kategori daha önce sisteme kayıt olmuştur !!!");
    }

    public Category update(Long id, Category request) {
        categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        id + " Güncellemeye çalıştığınız kategori sistemde bulunamadı. !!!."));

        Optional<Category> isCategoryExist = categoryRepository.findByName(request.getName());

        if (isCategoryExist.isPresent() && !isCategoryExist.get().getId().equals(id)) {
            throw new RuntimeException("Bu kategori farklı bir ID ile daha önce sisteme kayıt olmuştur !!!");
        }
        request.setId(id);
        return categoryRepository.save(request);
    }

    public void deleteById(Long id) {
        Category categoryFromDb = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(id + " id'li Kategori sistemde bulunamadı!!!"));

        List<Book> booksInCategory = bookService.findByCategoryId(id);

        if (!booksInCategory.isEmpty()) {
            throw new RuntimeException(
                    id + " id'li kategoriye ait sistemde kayıtlı kitap mevcut! Silme işlemi yapılamadı.");
        }

        categoryRepository.delete(categoryFromDb);
    }
}
