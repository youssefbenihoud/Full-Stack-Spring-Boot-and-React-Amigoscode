package com.example.demo.student;

import com.example.demo.student.exception.BadRequestException;
import com.example.demo.student.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@AllArgsConstructor
@Service
public class StudentService {

    private final StudentRepository studentRepository;


    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        // TODO: Check if email is taken
        boolean emailExists = studentRepository.selectExistsEmail(student.getEmail());
        if(emailExists){
            throw new BadRequestException(student.getEmail()+" exists already!");
        }
        studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        // TODO: Check if id exist
        boolean doesStudentExist = studentRepository.findById(id).isPresent();
        if(!doesStudentExist){
            throw new StudentNotFoundException(id+" is not found among the students!");
        }
        studentRepository.deleteById(id);
    }


}
