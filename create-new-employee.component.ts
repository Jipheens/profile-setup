import { BreakpointObserver } from "@angular/cdk/layout";
import { StepperOrientation } from "@angular/cdk/stepper";
import { Component, OnDestroy, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import * as XLSX from "xlsx";
import { map, Observable, Subject, takeUntil } from "rxjs";
import { NotificationServiceService } from "src/@core/Models/Notification/notification-service.service";
import { EmployeeService } from "src/app/Service/EmployeeService/employee.service";
import { DepartmentService } from "../../configurations/departments-management/department.service";
import { BranchService } from "../../configurations/location-management/branch-service/branch.service";
import { data } from "jquery";
import { DocumentManagementSystemService } from "src/app/Service/DocumentManagementSystem/document-management-system.service";
import { JobApplicationService } from "../../job-management/job-application.service";
import { JobgroupService } from "../../configurations/jobgroup/jobgroup.service";
import { ApplicantService } from "src/app/applicant/applicant.service";
import { HttpParams } from "@angular/common/http";
import { Base64PdfConvertorService } from "src/app/Service/Base64/base64-pdf-convertor.service";

export interface DocumentStructure{
            documentTitle: any;
            documentType:any;
            fileName:any;
            documentFile:any;
            fileExtension: any;
            referenceIdentifier:any;
}
export interface DocumentStructureArray extends Array<DocumentStructure> {}

@Component({
  selector: "app-create-new-employee",
  templateUrl: "./create-new-employee.component.html",
  styleUrls: ["./create-new-employee.component.scss"],
})


export class CreateNewEmployeeComponent implements OnInit, OnDestroy {

  religionArray: any = ["Christian", "Islam", "Irreligion", "Hindu", "Other"];
  educationLevelArray: any = [
    "Research Doctorate",
    "Advanced Intermediate Doctorate",
    "First Professional Doctorate",
    "Bachelors",
    "Associate",
    "Diploma",
    "Certificate",
    "Other",
  ];
  educationEnrollmentsArray: any = [
    "Full Time",
    "Part Time",
    "Graduated",
    "Enrolled",
    "Differed",
  ];
  enrollmentStatusArray: any = [
    "Contract",
    "Full Time",
    "Part Time",
    "Internship",
    "Attachment",
    "Secondment",
    "Direct Sales Representative"
  ];
  jobGroupArray: any = [];
  jobRoleArray: any = [];
  jsonDocuments: DocumentStructure;
  allDocumentsArray: DocumentStructureArray = [] 
  curentEducationLevelArray: any = [
    "Phd",
    "Masters",
    "Bachelors",
    "Diploma",
    "Certificate",
    "Other",
  ];
  gpaScoreArray: any = [
    "First Class Honours",
    "Second Class (Upper division)",
    "Second Class (Lower Division)",
    "Pass",
    "Other",
  ];
  jobPositionArray: any = [
    "Executive Position",
    "Lead Position",
    "Technical Engineer",
    "Technical Assistant",
    "Intermediate Position",
    "Entry Level",
    "Internship Level",
    "Attachment Level",
  ];
  educationColumns: any[] = [
    "index",
    "institutionName",
    "institutionLevel",
    "enrollOn",
    "graduatedOn",
    "gpaScore",
    "awardCertificate",
    "actions",
  ];
  experienceColumns: string[] = [
    "index",
    "companyName",
    "workPosition",
    "timeTaken",
    "actions",
  ];

  nextOfKinColumns: string[] = [
    "index",
    "name",
    "phoneNumber",
    "email",
    "address",
    "relationship",
    "actions",
  ];

  dependantsColumns: string[] = [
    "index",
    "dependantName",
    "dependantDob",
    "dependantPhone",
    "dependantEmail",
    "actions",
  ];

  dependantsDocsColumns: string[] = [
    "index",
    "documentTitle",
    "fileName",
    "documentType",
    "actions",
  ];

  maritalStatusArray: any = [
    "Single",
    "Married",
    "Divorced",
    "Separated",
    "Widow",
    "Widower",
    "Prefer not to say",
  ];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  nextOfKinDataSource: MatTableDataSource<any>;
  @ViewChild("nextOfKinPaginator") nextOfKinPaginator!: MatPaginator;
  @ViewChild(MatSort) nextOfKinSort!: MatSort;

  dependantDataSource: MatTableDataSource<any>;
  @ViewChild("dependantPaginator") dependantPaginator!: MatPaginator;
  @ViewChild(MatSort) dependantSort!: MatSort;

  educationDataSource: MatTableDataSource<any>;
  @ViewChild("educationPaginator") educationPaginator!: MatPaginator;
  @ViewChild(MatSort) educationSort!: MatSort;

  dependantsDocsDataSource: MatTableDataSource<any>;
  @ViewChild("dependantsDocsPaginator") dependantsDocsPaginator!: MatPaginator;
  @ViewChild(MatSort) depDocsSort!: MatSort;

  experienceDataSource: MatTableDataSource<any>;
  @ViewChild("experiencePaginator") experiencePaginator!: MatPaginator;
  @ViewChild(MatSort) experienceSort!: MatSort;

  stepperOrientation: Observable<StepperOrientation>;
  error: any;
  index: number;
  index2: number;
  index1: number;
  empindex: number;
  showMarriageCert: boolean = true;
  applicantData: any;
  loading: boolean = false;
  empEducationForm!: FormGroup;
  empEducationArray: any[] = [];
  workExpForm!: FormGroup;
  workExpArray: any[] = [];
  documentsArray: any[] = [];
  nextOfKinForm!: FormGroup;
  documentsFormData!: FormGroup;
  nextOfKinArray: any[] = [];
  dependantForm!: FormGroup;
  dependantArray: any[] = [];
  dependantDocsArray: any[] = [];
  showButtons: boolean = true;
  editButton: boolean = false;
  addButton: boolean = true;
  disableAddButton: boolean = false;
  disableActions: boolean = false;
  $destroy: Subject<boolean> = new Subject<boolean>();
  subCountiesHome: any;
  subCountiesCurrent: any;
  imageSrc: string;
  certificateFile: any;
  file: any;
  fileName: any = "";
  marriageFileName = "";
  marriageCertificateFile: any;
  showMarriageCertInput: boolean = false;
  showDependantsDocInputField: boolean = false;
  showFilledDependantsTable: boolean = false;
  pageStatus: any;
  departmnetData: any;
  branchData: any;
  onData: any;
  btnText: any;
  hideBtn = false;
  btnColor: any;
  titleRef: any;
  showWorkExpForm: boolean = true;
  showEducationForm: boolean = true;
  showNextOfKinForm: boolean = true;
  showDependantForm: boolean = true;
  showDocumentForm: boolean = true;
  matTabTitle: any;
  employeeId: number;
  applicantId: number;
  results: any;
  confirmBankAccount: boolean = true;
  showSubmitTab = true;
  showUploadTab = true;
  onSalaryNextbtn: boolean = true;
  index3: any;
  docsres: void;
  dmsres: void;
  fileAcess: any;
  exceldata: [][] | undefined;
  keys: string[];
  otherRows: any[];
  dataSheet = new Subject();
  headerRows: any;
  firstElement: any;
  excelSelected: boolean = false;
  fileInfos?: Observable<any>;
  values: any;
  finalValues: any;
  valuesArray: any;
  excelFileAccepted = false;
  // excelHeaderRef: any[] = [
  //   "alternativeEmail",
  //   "alternativePhone",
  //   "bankAccount",
  //   "bankName",
  //   "basicSalary",
  //   "branchCode",
  //   "cashPaymentAmount",
  //   "cashPaymentMeans",
  //   "cashPaymentReason",
  //   "city",
  //   "county",
  //   "courseProgram",
  //   "dcrsActualE2",
  //   "departmentId",
  //    "dob",
  //   "enrollmentStatus",
  //   "enrollmentEndDate",
  //   "enrollmentStartDate",
  //   "firstName",
  //   "firstRefCompany",
  //   "firstRefEmail",
  //   "firstRefName",
  //   "firstRefPhone",
  //   "gender",
  //   "gross_salary",
  //   "highestEducation",
  //   "homeAddress",
  //   "insuranceRelief",
  //   "jobGroupId",
  //   "kraNo",
  //   "lastName",
  //   "maritalStatus",
  //   "middleName",
  //   "nationalId",
  //   "nationality",
  //   "nhifNo",
  //   "nssfNo",
  //   "organizationRoleId",
  //   "ownerOccupiedInterests",
  //   "personalEmail",
  //   "personalPhone",
  //   "personalRelief",
  //   // "position",
  //   "postalAddress",
  //   "postalCode",
  //   "religion",
  //   // "reportingTo",
  //   "residentialCountry",
  //   "residentialCounty",
  //   "residentialSubCounty",
  //   "secondRefCompany",
  //   "secondRefEmail",
  //   "secondRefName",
  //   "secondRefPhone",
  //   "subCounty",
  //   "timeTaken",
  //   "totalNonCashBenefit",
  //   "valueOfQuarters",
  //   "workMail",
  // ];
  excelHeaderRef: any[] = [
    'bankAccount',
    'bankName',
    'dob',
    'enrollmentStatus',
    'firstName',
    'gender',
    'kraNo',
    'lastName',
    'nationalId',
    'nationality',
    'nhifNo',
    'nssfNo',	
    'personalEmail',
    'personalPhone',
    'personalRelief',
    'religion'	
  ];
  documentsData: any;
  nationalId: any;
  base64DocId: any;
  base64Doc: any;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    breakpointObserver: BreakpointObserver,
    private employeeAPI: EmployeeService,
    private successfulApplicant: JobApplicationService,
    private departmentAPI: DepartmentService,
    private branchAPI: BranchService,
    private notificationAPI: NotificationServiceService,
    private dialog: MatDialog,
    private jobGroupAPI: JobgroupService,
    private dmsAPI: DocumentManagementSystemService,
    private applicantService: ApplicantService,
    private datePipe: DatePipe,
    private base64Convertor: Base64PdfConvertorService,
  ) {
    this.onData = JSON.parse(localStorage.getItem("viewData"));
    console.log("local storage data", this.onData);
    this.stepperOrientation = breakpointObserver
      .observe("(min-width: 800px)")
      .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));
    this.getJobgroups();
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  ngOnInit(): void {
    this.initFormData();
    this.activatedRoute.params.subscribe((param) => {
      this.employeeId = param.id;
      console.log("EMP ID==key fromthe table", this.employeeId);
    });

    this.activatedRoute.params.subscribe((param) => {
      this.applicantId = param.id;
      console.log("Applicant ID ==key fromthe table", this.applicantId);
    });
    this.getPage();
    this.getDepartments();
    this.getBranches();
    this.initialiseEmpEducationForm();
    this.initialiseWorkExpForm();
    this.initialiseNextOfKinForm();
    this.initialisedependanForm();
    this.initdependantsDocs();
    this.getDocumentTitle();
    this.getOrganizationalRoles();
    this.hideFiledDependantsDocTable();
    // this.getDocumentsDetails(); 

  }

  onSuccessResponse() {
    return this.notificationAPI.alertSuccess("Successful Submission");
  }

  getJobgroups() {
    this.jobGroupAPI.read().subscribe((res) => {
      for (let i = 0; i < res.entity.length; i++) {
        let itemKey = {
          id: res.entity[i].id,
          name: res.entity[i].jobGroupName,
        };
        this.jobGroupArray.push(itemKey);
      }
    });
  }
  getOrganizationalRoles() {
    this.jobGroupAPI.readJobRole().subscribe((res) => {
      for (let i = 0; i < res.entity.length; i++) {
        let itemKey = {
          id: res.entity[i].id,
          name: res.entity[i].roleName,
        };
        console.log("Item Key", itemKey)
        this.jobRoleArray.push(itemKey);
      }
    });
  }

  initFormData(){
    console.log("Form Data", this.formData.controls)
  }

  formData: FormGroup = this.fb.group({
    empNo: ["", Validators.required],
    firstName: ["", Validators.required],
    middleName: [""],
    lastName: ["", Validators.required],
    dob: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
    maritalStatus: [""],
    gender: ["",Validators.required],
    religion: ["", Validators.required],
    nationalId: ["", Validators.required],
    employeeEducations: [[]],
    employeeWorkExperiences: [[]],
    nextOfKins: [[]],
    dependants: [[]],
    nationality: ["", Validators.nullValidator],
    county: ["", Validators.nullValidator],
    subCounty: ["", Validators.nullValidator],
    residentialCountry: ["", Validators.nullValidator],
    residentialCounty: ["", Validators.nullValidator],
    residentialSubCounty: ["", Validators.nullValidator],
    postalAddress: ["", Validators.nullValidator],
    postalCode: ["", Validators.nullValidator],
    city: ["", Validators.nullValidator],
    personalPhone: ["", Validators.required],
    alternativePhone: [""],
    personalEmail: ["", Validators.required],
    workMail: [""],
    // position: ["", Validators.required],
    alternativeEmail: [""],
    highestEducation: ["", Validators.nullValidator],
    courseProgram: ["", Validators.nullValidator],
    enrollmentStatus: ["", Validators.required],
    enrollmentStartDate: [
      { value: new Date(), disabled: false },
      Validators.nullValidator,
    ],
    enrollmentEndDate: [""],
    educationEnrollment: ["", Validators.nullValidator],
    firstRefName: [""],
    firstRefCompany: [""],
    firstRefPhone: [""],
    firstRefEmail: [""],
    secondRefName: [""],
    secondRefCompany: [""],
    secondRefPhone: [""],
    secondRefEmail: [""],
    departmentId: ["", Validators.required],
    organizationRoleId: ["", Validators.required],
    jobGroupId: ["", Validators.required],
    bankName: ["", Validators.required],
    bankAccount: ["", Validators.required],
    confirmBankAccount: ["", Validators.required],
    kraNo: ["", Validators.required],
    nssfNo: ["", Validators.required],
    nhifNo: ["", Validators.required],
    basicSalary: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    totalNonCashBenefit: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    valueOfQuarters: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    ownerOccupiedInterests: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    personalRelief: [
      "2400",
      [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
    ],
    insuranceRelief: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    dcrsActualE2: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
  });
  yearCheck(event: any) {
    if (this.empEducationForm.controls.enrollOn.value > event.target.value) {
      this.notificationAPI.alertWarning("Year of Graduation is invalid");
    } else {
      this.notificationAPI.alertSuccess("Year of Graduation Validated");
    }
  }

  hideFiledDependantsDocTable(){
    this.pageStatus = window.localStorage.getItem("viewData");
    if (this.pageStatus=== "VIEW"){
        this.showFilledDependantsTable = true;
    }
  }

  marriageStatus(selectedValue: MatSelectChange) {
    console.log("Marital Status", ":", selectedValue.value);

    if (selectedValue.value === "Married"){
      this.showMarriageCertInput = true;
    }else {
      this.showMarriageCertInput = false;

    }
  }

  getDocumentTitle(): string {
    const firstName = this.formData.controls.firstName.value;
    const lastName = this.formData.controls.lastName.value;
    return `${firstName} ${lastName} Certificate`;
  }

  marriageCertFormData: FormGroup = this.fb.group({
    id: [""],
    fileName: [""],
    fileExtension: [""],
    documentTitle: this.getDocumentTitle(),
    documentType: [""],
    documentFile: [""],
    referenceIdentifier: [""],
  });

  initdependantsDocs() {
    this.documentsFormData = this.fb.group({
      id: [""],
      fileName: [""],
      fileExtension: [""],
      documentTitle: [`${this.dependantForm.controls.dependantName} Certificate`],
      documentType: [""],
      documentFile: [""],
      referenceIdentifier: [""],
    });
  }

  displayDependantFileInput(event: any){
    console.log("value",event.target.value)

    
    if (event.target.value.trim() !== ''){
      this.showDependantsDocInputField = true;
    }
    else {
      this.showDependantsDocInputField = false;

    }
  }

  dependantsDocs: FormGroup = this.fb.group({
    dependants: [[]],
  });

  addDependantsDocs() {
    if (this.documentsFormData.valid) {
      this.dependantDocsArray.push(this.documentsFormData.value);

      console.log(
        "Documents from Dependants ===form Data",
        this.documentsFormData.value
      );

      // console.log("Dependant Array", this.dependantDocsArray);
    }
    this.resetDependantDocForm();
    console.log(
      "Documents from Dependants Main Form",
      this.dependantsDocs.value
    );
    console.log("Dependant Array", this.dependantDocsArray);
    // console.log("Dependant Array in the form", this.dependantsDocs.value);
    // console.log("Dependant Array in the form 2", this.dependantsDocs.controls.dependants.value);

    // console.log("Documents from Dependants", this.dependantsDocs.value)
  }

 

  documentsUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "application/pdf") {
        const maxSize = 2 * 1024 * 1024;
        if (selectedFile.size <= maxSize) {
          const filePath = event.target.value.replace("C:\\fakepath\\", "");
          const reader: FileReader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            this.file = reader.result;
            // console.log("Marriage Doc", this.file);

            console.log("Form in onload", this.marriageCertFormData)

            console.log("Form in onload 2", this.marriageCertFormData.controls)
            this.marriageFileName = filePath.split(".")[0];
            const fileExtension: string = filePath.split(".")[1];

            this.marriageCertFormData.controls.documentTitle.setValue(
              `${this.formData.controls.firstName.value} ${this.formData.controls.lastName.value} Marriage Certificate`
            );
            this.marriageCertFormData.controls.documentType.setValue(
              "Employee Document"
            );
            this.marriageCertFormData.controls.fileName.setValue(
              this.marriageFileName
            );
            this.marriageCertFormData.controls.fileExtension.setValue(
              fileExtension
            );
            this.marriageCertFormData.controls.documentFile.setValue(this.file);
            this.marriageCertFormData.controls.referenceIdentifier.setValue(
              this.formData.controls.nationalId.value
            );
            this.jsonDocuments = {
              documentTitle:this.marriageCertFormData.value.documentTitle, 
              documentType: this.marriageCertFormData.value.documentType,
              fileName: this.marriageCertFormData.value.fileName,
              documentFile: this.marriageCertFormData.value.documentFile,
              fileExtension: this.marriageCertFormData.value.fileExtension,
              referenceIdentifier: this.marriageCertFormData.value.referenceIdentifier
            }
            console.log("New documents of json", this.jsonDocuments);
            this.allDocumentsArray.push(this.jsonDocuments)
            console.log("New documents of json", this.allDocumentsArray);

          };
          reader.onerror = (error) => {
            this.notificationAPI.alertWarning(error);
          };

          event.target.value = null;
        } else {
          alert("File size exceeds the limit of 2MB.");
        }
      } else {
        alert("Only PDF files are allowed.");
      }
    }
  }



  marriageCertUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      console.log("file size", selectedFile.size);
      // const file: File = event.target.files[0];

      // Check the file type
      if (selectedFile.type === "application/pdf") {
        // Check the file size
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        console.log("byte size", maxSize);
        if (selectedFile.size <= maxSize) {
          const filePath = event.target.value.replace("C:\\fakepath\\", "");
          console.log("The file", filePath);
          const reader: FileReader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            this.file = reader.result;
            console.log("Dependant Doc", this.file);
            this.fileName = filePath.split(".")[0];
        
            const fileExtension: string = filePath.split(".")[1];
            console.log("File Name", this.fileName);
            console.log("File Extension", fileExtension);
            this.documentsFormData.controls.documentTitle.setValue(
              this.formData.controls.firstName.value +
                "" + "" +  this.formData.controls.lastName.value
                 +
                " " +
                "Marriage Certificate"
            );
            this.documentsFormData.controls.documentType.setValue(
              "Employee Document"
            );
            this.documentsFormData.controls.fileName.setValue(this.fileName);
            this.documentsFormData.controls.fileExtension.setValue(
              fileExtension
            );
            this.documentsFormData.controls.documentFile.setValue(this.file);

            this.documentsFormData.controls.referenceIdentifier.setValue(
              this.formData.controls.nationalId.value
            );

            console.log(
              "Birth Cert from upload func",
              this.documentsFormData.value
            );

            this.jsonDocuments = {
              documentTitle:this.documentsFormData.value.documentTitle, 
              documentType: this.documentsFormData.value.documentType,
              fileName: this.documentsFormData.value.fileName,
              documentFile: this.documentsFormData.value.documentFile,
              fileExtension: this.documentsFormData.value.fileExtension,
              referenceIdentifier: this.documentsFormData.value.referenceIdentifier
            }
            console.log("New documents of json", this.jsonDocuments);
            this.allDocumentsArray.push(this.jsonDocuments)
            console.log("New documents of json", this.allDocumentsArray);


            event.target.value = null;
          };

          reader.onerror = (error) => {
            this.notificationAPI.alertWarning(error);
          };
        } else {
          // File size exceeds the limit
          alert("File size exceeds the limit of 2MB.");
        }
      } else {
        // Invalid file type
        alert("Only PDF files are allowed.");
      }
    }
  }
  dependantCertUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      console.log("file size", selectedFile.size);
      // const file: File = event.target.files[0];

      // Check the file type
      if (selectedFile.type === "application/pdf") {
        // Check the file size
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        console.log("byte size", maxSize);
        if (selectedFile.size <= maxSize) {
          const filePath = event.target.value.replace("C:\\fakepath\\", "");
          console.log("The file", filePath);
          const reader: FileReader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            this.file = reader.result;
            console.log("Dependant Doc", this.file);
            this.fileName = filePath.split(".")[0];
        
            const fileExtension: string = filePath.split(".")[1];
            console.log("File Name", this.fileName);
            console.log("File Extension", fileExtension);
            this.documentsFormData.controls.documentTitle.setValue(
              this.dependantForm.controls.dependantName.value +
                "" +
                "" +
                " " +
                "Birth Certificate"
            );
            this.documentsFormData.controls.documentType.setValue(
              "Employee Document"
            );
            this.documentsFormData.controls.fileName.setValue(this.fileName);
            this.documentsFormData.controls.fileExtension.setValue(
              fileExtension
            );
            this.documentsFormData.controls.documentFile.setValue(this.file);

            this.documentsFormData.controls.referenceIdentifier.setValue(
              this.formData.controls.nationalId.value
            );

            console.log(
              "Birth Cert from upload func",
              this.documentsFormData.value
            );

            this.jsonDocuments = {
              documentTitle:this.documentsFormData.value.documentTitle, 
              documentType: this.documentsFormData.value.documentType,
              fileName: this.documentsFormData.value.fileName,
              documentFile: this.documentsFormData.value.documentFile,
              fileExtension: this.documentsFormData.value.fileExtension,
              referenceIdentifier: this.documentsFormData.value.referenceIdentifier
            }
            console.log("New documents of json", this.jsonDocuments);
            this.allDocumentsArray.push(this.jsonDocuments)
            console.log("New documents of json", this.allDocumentsArray);


            event.target.value = null;
          };

          reader.onerror = (error) => {
            this.notificationAPI.alertWarning(error);
          };
        } else {
          // File size exceeds the limit
          alert("File size exceeds the limit of 2MB.");
        }
      } else {
        // Invalid file type
        alert("Only PDF files are allowed.");
      }
    }
  }

 
  resetDependantDocForm() {
    this.dependantsDocs.setValue({
      dependants: this.dependantDocsArray,
    });
    console.log(
      "Documents from Dependants Main Form two",
      this.dependantsDocs.value
    );
    this.getDependantsDocs();
    this.initdependantsDocs();
    // this.documentsFormData.controls.fileName.setValue("");
    // this.documentsFormData.controls.fileExtension.setValue("");
    // this.documentsFormData.controls.documentTitle.setValue("");
    // this.documentsFormData.controls.documentType.setValue("");
    // this.documentsFormData.controls.documentFile.setValue("");
  }

  getDependantsDocs() {
    this.dependantsDocsDataSource = new MatTableDataSource(
      this.dependantDocsArray
    );
    this.dependantsDocsDataSource.paginator = this.dependantsDocsPaginator;
    this.dependantsDocsDataSource.sort = this.depDocsSort;
  }

  updateDependantDocItem() {
    this.editButton = false;
    this.addButton = true;
    this.dependantDocsArray[this.index3] = this.documentsFormData.value;
    this.dependantsDocs.setValue({
      dependants: this.dependantDocsArray,
    });
    this.resetDependantDocForm();
  }

  deleteDependantDocItem(data: any) {
    let deleteDependentDocIndex = this.dependantArray.indexOf(data);
    this.dependantDocsArray.splice(deleteDependentDocIndex, 1);
    this.resetDependantDocForm();
  }

  dependantDocsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dependantsDocsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.dependantsDocsDataSource.paginator) {
      this.dependantsDocsDataSource.paginator.firstPage();
    }
  }


  initEmpEducationForm() {
    this.empEducationForm = this.fb.group({
      awardCertificate: [""],
      certificateFile: [""],
      enrollOn: [""],
      gpaScore: [""],
      graduatedOn: [""],
      id: [""],
      institutionLevel: [""],
      institutionName: [""],
    });
  }
  initialiseEmpEducationForm() {
    this.initEmpEducationForm();
    this.empEducationForm.controls.awardCertificate.setValidators([
      Validators.nullValidator,
    ]);
    this.empEducationForm.controls.certificateFile.setValidators([
      Validators.nullValidator,
    ]);
    this.empEducationForm.controls.enrollOn.setValidators([
      Validators.nullValidator,
    ]);
    this.empEducationForm.controls.gpaScore.setValidators([
      Validators.nullValidator,
    ]);
    this.empEducationForm.controls.graduatedOn.setValidators([
      Validators.nullValidator,
    ]);
    this.empEducationForm.controls.institutionLevel.setValidators([
      Validators.nullValidator,
    ]);
    this.empEducationForm.controls.institutionName.setValidators([
      Validators.nullValidator,
    ]);
  }

  onEnrollmentStatusChange(): void {
    const enrollmentStatusControl = this.formData.get("enrollmentStatus");

    if (enrollmentStatusControl.value !== "Full Time") {
      this.formData.get("enrollmentEndDate")?.enable();
    } else {
      this.formData.get("enrollmentEndDate")?.disable();
    }
  }

  addEmpEducation() {
    if (this.empEducationForm.valid) {
      this.empEducationArray.push(this.empEducationForm.value);
      this.resetEmpEducationForm();
    }
  }
  resetEmpEducationForm() {
    this.formData.patchValue({
      employeeEducations: this.empEducationArray,
    });
    this.getEmpEducation();
    this.initialiseEmpEducationForm();
    this.empEducationForm.controls.certificateFile.setValue("");
    this.imageSrc = "";
  }

  getEmpEducation() {
    this.educationDataSource = new MatTableDataSource(this.empEducationArray);
    this.educationDataSource.paginator = this.educationPaginator;
    this.educationDataSource.sort = this.educationSort;
  }
  editEduItem(data: any) {
    this.empindex = this.empEducationArray.indexOf(data);
    this.editButton = true;
    this.addButton = false;
    this.empEducationForm.patchValue({
      awardCertificate: data.awardCertificate,
      certificateFile: data.certificateFile,
      enrollOn: data.enrollOn,
      gpaScore: data.gpaScore,
      graduatedOn: data.graduatedOn,
      id: data.id,
      institutionLevel: data.institutionLevel,
      institutionName: data.institutionName,
    });
  }
  updateEmpEducation() {
    this.editButton = false;
    this.addButton = true;
    this.empEducationArray[this.empindex] = this.empEducationForm.value;
    this.formData.patchValue({
      employeeEducations: this.empEducationArray,
    });
    this.resetEmpEducationForm();
  }
  deleteEduItem(data: any) {
    let deleteIndex = this.empEducationArray.indexOf(data);
    this.empEducationArray.splice(deleteIndex, 1);
    this.resetEmpEducationForm();
  }

  certUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      console.log("File reader", reader);
      let fili = reader.readAsDataURL(event.target.files[0]);

      reader.onload = () => {
        this.certificateFile = reader.result;
        console.log("This Certificate", this.certificateFile.filename);
        console.log("File reading 2", reader.result);

        this.empEducationForm.controls.certificateFile.setValue(
          this.certificateFile
        );
        this.imageSrc = reader.result as string;

        console.log("File reading 3", this.imageSrc);
      };
      reader.onerror = (error) => {
        this.notificationAPI.alertWarning(error);
      };
    }
  }

  educationFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.educationDataSource.filter = filterValue.trim().toLowerCase();
    if (this.educationDataSource.paginator) {
      this.educationDataSource.paginator.firstPage();
    }
  }

  initworkExpForm() {
    this.workExpForm = this.fb.group({
      id: [""],
      companyName: [""],
      workPosition: [""],
      timeTaken: [""],
    });
  }

  initialiseWorkExpForm() {
    this.initworkExpForm();
    this.workExpForm.controls.id.setValidators(Validators.nullValidator);
    this.workExpForm.controls.companyName.setValidators([
      Validators.nullValidator,
    ]);
    this.workExpForm.controls.workPosition.setValidators([
      Validators.nullValidator,
    ]);
    this.workExpForm.controls.timeTaken.setValidators([
      Validators.nullValidator,
    ]);
  }
  addWorkExp() {
    if (this.workExpForm.valid) {
      this.workExpArray.push(this.workExpForm.value);
      this.resetWorkExpForm();
    }
  }
  getWorkExp() {
    this.experienceDataSource = new MatTableDataSource(this.workExpArray);
    this.experienceDataSource.paginator = this.experiencePaginator;
    this.experienceDataSource.sort = this.experienceSort;
  }

  resetWorkExpForm() {
    this.formData.patchValue({
      employeeWorkExperiences: this.workExpArray,
    });
    this.getWorkExp();
    this.initialiseWorkExpForm();
  }
  editItem(data: any) {
    this.index = this.workExpArray.indexOf(data);
    this.editButton = true;
    this.addButton = false;
    this.workExpForm.patchValue({
      id: data.id,
      companyName: data.companyName,
      workPosition: data.workPosition,
      timeTaken: data.timeTaken,
    });
  }

  editKinItem(data: any) {
    this.index1 = this.nextOfKinArray.indexOf(data);
    this.editButton = true;
    this.addButton = false;
    this.nextOfKinForm.patchValue({
      id: data.id,
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      relationship: data.relationship,
    });
  }
  updateWorkExp() {
    this.editButton = false;
    this.addButton = true;
    this.workExpArray[this.index] = this.workExpForm.value;
    this.formData.patchValue({
      employeeWorkExperiences: this.workExpArray,
    });
    this.resetWorkExpForm();
  }
  deleteItem(data: any) {
    let deleteIndex = this.workExpArray.indexOf(data);
    this.workExpArray.splice(deleteIndex, 1);
    this.resetWorkExpForm();
  }
  experienceFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.experienceDataSource.filter = filterValue.trim().toLowerCase();
    if (this.experienceDataSource.paginator) {
      this.experienceDataSource.paginator.firstPage();
    }
  }

  initNextOfKinForm() {
    this.nextOfKinForm = this.fb.group({
      id: [""],
      name: [""],
      phoneNumber: [""],
      email: [""],
      address: [""],
      relationship: [""],
    });
  }

  initialiseNextOfKinForm() {
    this.initNextOfKinForm();
    this.nextOfKinForm.controls.id.setValidators(Validators.nullValidator);
    this.nextOfKinForm.controls.name.setValidators([Validators.nullValidator]);
    this.nextOfKinForm.controls.phoneNumber.setValidators([
      Validators.nullValidator,
    ]);
    this.nextOfKinForm.controls.address.setValidators([
      Validators.nullValidator,
    ]);
    this.nextOfKinForm.controls.email.setValidators([Validators.nullValidator]);
    this.nextOfKinForm.controls.relationship.setValidators([
      Validators.nullValidator,
    ]);
  }

  addNextOfKin() {
    if (this.nextOfKinForm.valid) {
      this.nextOfKinArray.push(this.nextOfKinForm.value);
      this.resetNextOfKinForm();
    }
  }

  getNextOfKin() {
    this.nextOfKinDataSource = new MatTableDataSource(this.nextOfKinArray);
    this.nextOfKinDataSource.paginator = this.nextOfKinPaginator;
    this.nextOfKinDataSource.sort = this.nextOfKinSort;
  }

  resetNextOfKinForm() {
    this.formData.patchValue({
      nextOfKins: this.nextOfKinArray,
    });

    this.getNextOfKin();
    this.initialiseNextOfKinForm();
  }

  updateNextOfKin() {
    this.editButton = false;
    this.addButton = true;
    this.nextOfKinArray[this.index] = this.nextOfKinForm.value;
    this.formData.patchValue({
      nextOfKins: this.nextOfKinArray,
    });
    this.resetNextOfKinForm();
  }

  deleteNxtKinItem(data: any) {
    let deleteIndex = this.nextOfKinArray.indexOf(data);
    this.nextOfKinArray.splice(deleteIndex, 1);
    this.resetNextOfKinForm();
  }

  nextOfKinFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.nextOfKinDataSource.filter = filterValue.trim().toLowerCase();
    if (this.nextOfKinDataSource.paginator) {
      this.nextOfKinDataSource.paginator.firstPage();
    }
  }

  initdependanForm() {
    this.dependantForm = this.fb.group({
      id: [""],
      dependantName: [""],
      dependantDob: [""],
      //birthCertificateFile: [" "],
      dependantPhone: [" "],
      dependantEmail: [" "],
    });
  }

  initialisedependanForm() {
    this.initdependanForm();
    this.dependantForm.controls.id.setValidators(Validators.nullValidator);
    this.dependantForm.controls.dependantName.setValidators([
      Validators.nullValidator,
    ]);
    this.dependantForm.controls.dependantDob.setValidators([
      Validators.nullValidator,
    ]);
    this.dependantForm.controls.dependantPhone.setValidators(
      Validators.nullValidator
    );
    this.dependantForm.controls.dependantEmail.setValidators([
      Validators.nullValidator,
    ]);
  }
  addDependant() {
    if (this.dependantForm.valid) {
      this.dependantArray.push(this.dependantForm.value);
      this.resetdependantForm();
    }
  }

  resetdependantForm() {
    this.formData.patchValue({
      dependants: this.dependantArray,
    });
    this.getDependant();
    this.initialisedependanForm();
  }

  getDependant() {
    this.dependantDataSource = new MatTableDataSource(this.dependantArray);
    this.dependantDataSource.paginator = this.dependantPaginator;
    this.dependantDataSource.sort = this.dependantSort;
  }

  getDependants() {
    this.dependantDataSource = new MatTableDataSource(this.dependantArray);
    this.dependantDataSource.paginator = this.dependantPaginator;
    this.dependantDataSource.sort = this.dependantSort;
  }

  editDependantItem(data: any) {
    this.index2 = this.dependantArray.indexOf(data);
    this.editButton = true;
    this.addButton = false;
    this.dependantForm.patchValue({
      id: data.id,
      dependantName: data.dependantName,
      dependantDob: data.dependantDob,
      birthCertificateFile: data.birthCertificateFile,
      dependantPhone: data.dependantPhone,
      dependantEmail: data.dependantEmail,
    });
  }

  updateDependantItem() {
    this.editButton = false;
    this.addButton = true;
    this.dependantArray[this.index2] = this.dependantForm.value;
    this.formData.patchValue({
      dependants: this.dependantArray,
    });
    this.resetdependantForm();
  }

  deleteDependantItem(data: any) {
    let deleteDependentIndex = this.dependantArray.indexOf(data);
    this.dependantArray.splice(deleteDependentIndex, 1);
    this.resetdependantForm();
  }

  dependantFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dependantDataSource.filter = filterValue.trim().toLowerCase();
    if (this.dependantDataSource.paginator) {
      this.dependantDataSource.paginator.firstPage();
    }
  }

  getDepartments() {
    this.loading = true;
    this.departmentAPI.readaActive().subscribe({
      next: (res) => {
        if (res.statusCode === 302) {
          this.loading = false;
          this.departmnetData = res.entity;
          console.log("Department Data", this.departmnetData);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        this.notificationAPI.alertWarning(
          "Server Error: Unable to load Departments."
        );
      },
      complete: () => {},
    });
  }

  getBranches() {
    this.loading = true;
    this.branchAPI.readaActive().subscribe({
      next: (res) => {
        if (res.statusCode === 302) {
          this.loading = false;
          this.branchData = res.entity;
          console.log("Location Data", this.branchData);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        this.notificationAPI.alertWarning(
          "Server Error: Unable to load Locations."
        );
      },
      complete: () => {},
    });
  }

  onUpload(evt: any) {
    const file: File = evt.target.files[0];
    this.fileAcess = file;
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1)
      throw new Error("Multiple Files Not Supported!");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.exceldata = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (this.exceldata) {
        this.excelSelected = true;
      }

      this.headerRows = this.exceldata[0];
      this.otherRows = this.exceldata.slice(1);
      this.firstElement = this.headerRows[0];
      this.headerRows = this.headerRows.filter((e: any) => e.length);

      this.otherRows = this.otherRows.filter((e) => e.length);

      this.values = this.otherRows.map((e) =>
        this.headerRows.reduce(
          (o: any, f: any, j: any) => Object.assign(o, { [f]: e[j] }),
          {}
        )
      );

      this.finalValues = this.values.filter(
        (value: {}) => Object.keys(value).length !== 0
      );
      this.headerRows = this.headerRows.map(function (el: any) {
        return el.trim();
      });
      this.compareExcelHeaders();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  compareExcelHeaders() {
    if (this.headerRows.length != this.excelHeaderRef.length) {
      this.notificationAPI.alertWarning(
        "PLEASE CONFIRM ALL FIELDS ARE PRESENT INCHECK THE UPLOADED EXCEL FILE!"
      );
    } else if (this.headerRows.length == this.excelHeaderRef.length) {
      if (
        JSON.stringify(this.headerRows) === JSON.stringify(this.excelHeaderRef)
      ) {
        this.excelFileAccepted = true;
        this.notificationAPI.alertSuccess("THE EXCEL FILE IS VALID!");
      } else if (
        JSON.stringify(this.headerRows) !== JSON.stringify(this.excelHeaderRef)
      ) {
        this.excelFileAccepted = false;
        this.notificationAPI.alertWarning(
          "PLEASE CHECK THE UPLOADED EXCEL FILE, AND TRY AGAIN!"
        );
      }
    }
  }
  onSubmitMultiple() {
    this.loading = true;
    console.log("Excel", this.finalValues);

    this.employeeAPI
      .createMultiple(this.finalValues)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res) => {
          if (res.statusCode === 201) {
            this.loading = false;

            this.notificationAPI.alertSuccess(res.message);
            window.localStorage.removeItem("excelFileData");
            this.router.navigate(['administration/employees/pending'])
          } else {
            this.loading = false;
            this.notificationAPI.alertWarning(res.message);
          }
        },
        error: (err) => {
          this.loading = false;
          this.notificationAPI.alertWarning("Server Error: Try Again Later");
        },
        complete: () => {},
      });
  }
  disableControlls() {
    this.formData.disable();
  }
  getSuccessfulApplicant() {
    this.loading = false;
    this.successfulApplicant
      .readSuccessfulApplicantById(this.applicantId)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res) => {
          if (res.statusCode === 302) {
             this.loading = false;
             this.results = res.entity;
             this.nationalId = this.results.nationalId;
             console.log("res", this.results);
             this.getDocumentsDetails();
             this.formData = this.fb.group({
              id: [this.results.id],
              empNo: [this.results.empNo],
              firstName: [this.results.firstName],
              middleName: [this.results.middleName],
              lastName: [this.results.lastName],
              dob: [this.results.dob],
              maritalStatus: [this.results.maritalStatus],
              gender: [this.results.gender],
              religion: [this.results.religion],
              nationalId: [this.results.nationalId],
              employeeStatus: [this.results.employeeStatus],
              employeeEducations: [[]],
              employeeWorkExperiences: [[]],
              nextOfKins: [[]],
              dependants: [[]],
              enrollmentStartDate: [this.results.enrollmentStartDate],
              enrollmentEndDate: [this.results.enrollmentEndDate],
              nationality: [this.results.nationality],
              county: [this.results.county],
              subCounty: [this.results.subCounty],
              residentialCountry: [this.results.residentialCountry],
              residentialCounty: [this.results.residentialCounty],
              residentialSubCounty: [this.results.residentialSubCounty],
              postalAddress: [this.results.postalAddress],
              postalCode: [this.results.postalCode],
              city: [this.results.city],
              personalPhone: [this.results.personalPhone],
              alternativePhone: [this.results.alternativePhone],
              personalEmail: [this.results.personalEmail],
              workMail: [this.results.workMail],
              position: [this.results.position],
              alternativeEmail: [this.results.alternativeEmail],
              highestEducation: [this.results.highestEducation],
              courseProgram: [this.results.courseProgram],
              enrollmentStatus: [this.results.enrollmentStatus],
              educationEnrollment: [this.results.educationEnrollment],
              firstRefName: [this.results.firstRefName],
              firstRefCompany: [this.results.firstRefCompany],
              firstRefPhone: [this.results.firstRefPhone],
              firstRefEmail: [this.results.firstRefEmail],
              secondRefName: [this.results.secondRefName],
              secondRefCompany: [this.results.secondRefCompany],
              secondRefPhone: [this.results.secondRefPhone],
              secondRefEmail: [this.results.secondRefEmail],
              departmentId: [this.results.departmentId],
              organizationRoleId: [this.results.organizationRoleId],
              jobGroupId: [this.results.jobGroupId],
              bankName: [this.results.bankName],
              branchCode: [this.results.branchCode],
              bankAccount: [this.results.bankAccount],
              confirmBankAccount: [this.results.confirmBankAccount],
              kraNo: [this.results.kraNo],
              nssfNo: [this.results.nssfNo],
              nhifNo: [this.results.nhifNo],
              basicSalary: [this.results.basicSalary],
              totalNonCashBenefit: [this.results.totalNonCashBenefit],
              valueOfQuarters: [this.results.valueOfQuarters],
              ownerOccupiedInterests: [this.results.ownerOccupiedInterests],
              personalRelief: [this.results.personalRelief],
              insuranceRelief: [this.results.insuranceRelief],
              dcrsActualE2: [this.results.dcrsActualE2],
            });
            this.empEducationArray = this.results.applicantEducations;
            this.results.applicantEducations.forEach((eduelement: any) => {
              this.empEducationArray.push(eduelement);
            });
            this.getEmpEducation();
            this.workExpArray = this.results.applicantWorkExperiences;
            this.results.applicantWorkExperiences.forEach((expelement: any) => {
              this.workExpArray.push(expelement);
            });
            this.getWorkExp();
            this.nextOfKinArray = this.results.nextOfKins;
            this.results.nextOfKins.forEach((nextKinelement: any) => {
              this.nextOfKinArray.push(nextKinelement);
            });
            this.getNextOfKin();
            this.dependantArray = this.results.dependants;
            this.results.dependants.forEach((dependantElement: any) => {
              this.dependantArray.push(dependantElement);
            });
            this.getDependants();
          } else {
            this.loading = false;
            this.notificationAPI.alertWarning(
              "ERROR IN LOADING EMPLOYEE DATA:"
            );
          }
        },
        error: (err) => {
          this.loading = false;
        },
        complete: () => {},
      });
  }
  getData() {
    this.loading = false;
    this.employeeAPI
      .findById(this.employeeId)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res) => {
          if (res.statusCode === 302) {
            this.loading = false;
            this.results = res.entity;
            console.log("res", this.results);
            this.nationalId = this.results.nationalId;
            this.getDocumentsDetails(); 
            this.formData = this.fb.group({
              id: [this.results.id],
              empNo: [this.results.empNo],
              firstName: [this.results.firstName],
              middleName: [this.results.middleName],
              lastName: [this.results.lastName],
              dob: [this.results.dob],
              maritalStatus: [this.results.maritalStatus],
              gender: [this.results.gender],
              religion: [this.results.religion],
              nationalId: [this.results.nationalId],
              employeeStatus: [this.results.employeeStatus],
              employeeEducations: [[]],
              employeeWorkExperiences: [[]],
              nextOfKins: [[]],
              dependants: [[]],
              enrollmentStartDate: [this.results.enrollmentStartDate],
              enrollmentEndDate: [this.results.enrollmentEndDate],
              nationality: [this.results.nationality],
              county: [this.results.county],
              subCounty: [this.results.subCounty],
              residentialCountry: [this.results.residentialCountry],
              residentialCounty: [this.results.residentialCounty],
              residentialSubCounty: [this.results.residentialSubCounty],
              postalAddress: [this.results.postalAddress],
              postalCode: [this.results.postalCode],
              city: [this.results.city],
              personalPhone: [this.results.personalPhone],
              alternativePhone: [this.results.alternativePhone],
              personalEmail: [this.results.personalEmail],
              workMail: [this.results.workMail],
              position: [this.results.position],
              alternativeEmail: [this.results.alternativeEmail],
              highestEducation: [this.results.highestEducation],
              courseProgram: [this.results.courseProgram],
              enrollmentStatus: [this.results.enrollmentStatus],
              educationEnrollment: [this.results.educationEnrollment],
              firstRefName: [this.results.firstRefName],
              firstRefCompany: [this.results.firstRefCompany],
              firstRefPhone: [this.results.firstRefPhone],
              firstRefEmail: [this.results.firstRefEmail],
              secondRefName: [this.results.secondRefName],
              secondRefCompany: [this.results.secondRefCompany],
              secondRefPhone: [this.results.secondRefPhone],
              secondRefEmail: [this.results.secondRefEmail],
              departmentId: [this.results.departmentId],
              organizationRoleId: [this.results.organizationRoleId],
              jobGroupId: [this.results.jobGroupId],
              bankName: [this.results.bankName],
              branchCode: [this.results.branchCode],
              bankAccount: [this.results.bankAccount],
              confirmBankAccount: [this.results.confirmBankAccount],
              kraNo: [this.results.kraNo],
              nssfNo: [this.results.nssfNo],
              nhifNo: [this.results.nhifNo],
              basicSalary: [this.results.basicSalary],
              totalNonCashBenefit: [this.results.totalNonCashBenefit],
              valueOfQuarters: [this.results.valueOfQuarters],
              ownerOccupiedInterests: [this.results.ownerOccupiedInterests],
              personalRelief: [this.results.personalRelief],
              insuranceRelief: [this.results.insuranceRelief],
              dcrsActualE2: [this.results.dcrsActualE2],
            });
            this.empEducationArray = this.results.employeeEducations;
            this.results.employeeEducations.forEach((eduelement: any) => {
              this.empEducationArray.push(eduelement);
            });
            this.getEmpEducation();
            this.workExpArray = this.results.employeeWorkExperiences;
            this.results.employeeWorkExperiences.forEach((expelement: any) => {
              this.workExpArray.push(expelement);
            });
            this.getWorkExp();
            this.nextOfKinArray = this.results.nextOfKins;
            this.results.nextOfKins.forEach((nextKinelement: any) => {
              this.nextOfKinArray.push(nextKinelement);
            });
            this.getNextOfKin();
            this.dependantArray = this.results.dependants;
            this.results.dependants.forEach((dependantElement: any) => {
              this.dependantArray.push(dependantElement);
            });
            this.getDependants();
          } else {
            this.loading = false;
            this.notificationAPI.alertWarning(
              "ERROR IN LOADING EMPLOYEE DATA:"
            );
          }
        },
        error: (err) => {
          this.loading = false;
        },
        complete: () => {},
      });
  }

  getDocumentsDetails() {
    let param = new HttpParams().set("refId", this.nationalId);
    this.dmsAPI.getDocumentsByReferenceId(param).subscribe({
      next: (res) => {
        this.documentsData = res.entity;
        console.log("Documents", this.documentsData);
        for (let i=0; i<this.documentsData.length; i++){
          this.base64DocId = this.documentsData[i].id;
        }
        console.log("Document Id", this.base64DocId)
        this.getBasic64IdDoc(this.base64DocId);
        this.dataSource = new MatTableDataSource(this.documentsData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notificationAPI.alertWarning("Server Error!");
      },
      complete: () => {},
    });
  }

  getBasic64IdDoc(id: any){
    this.loading = true;
    console.log("Id of Doc", id);
    this.dmsAPI.getBase64ById(id).pipe(takeUntil(this.$destroy)).subscribe(
        {
          next: (res) => {
            this.base64Doc = res.entity;

            // this.base64StringData = res.entity;
            console.log("Base 64 doc ", this.base64Doc);

    
          
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.notificationAPI.alertWarning("Server Error!");
          },
          complete: () => {},

        }
      )
  }

  convertAndDownloadPdf(): void {
    this.base64Convertor.convertBase64ToPdf(
      this.base64Doc,
      this.fileName
    );
  }

  onKeyUp(event: any) {
    if (this.formData.controls.bankAccount.value !== event.target.value) {
      this.notificationAPI.alertWarning("Bank Account Numbers Don't Match!!");
    } else {
      this.notificationAPI.alertSuccess("Bank Account Numbers Matches.");
    }
  }
  getPage() {
    if (this.onData == "ADD") {
      this.formData = this.fb.group({
        // empNo: [{ value: "", disabled: true }],
        firstName: ["", Validators.required],
        middleName: [""],
        lastName: ["", Validators.required],
        dob: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
        maritalStatus: [""],
        gender: ["", Validators.required],
        religion: ["", Validators.required],
        nationalId: ["", Validators.required],
        employeeEducations: [[]],
        employeeWorkExperiences: [[]],
        nextOfKins: [[]],
        dependants: [[]],
        enrollmentStartDate: [new Date(), Validators.required],
        enrollmentEndDate: [""],
        nationality: ["Kenyan", Validators.required],
        county: ["", Validators.nullValidator],
        subCounty: ["", Validators.nullValidator],
        residentialCountry: ["Kenya", Validators.nullValidator],
        residentialCounty: ["", Validators.nullValidator],
        residentialSubCounty: ["", Validators.nullValidator],
        postalAddress: ["", Validators.nullValidator],
        postalCode: ["", Validators.nullValidator],
        city: ["", Validators.nullValidator],
        personalPhone: ["", Validators.nullValidator],
        alternativePhone: [""],
        personalEmail: ["", Validators.nullValidator],
        position: ["", Validators.nullValidator],
        workMail: [""],
        alternativeEmail: [""],
        highestEducation: ["", Validators.nullValidator],
        courseProgram: ["", Validators.nullValidator],
        enrollmentStatus: ["", Validators.required],
        educationEnrollment: ["", Validators.nullValidator],
        firstRefName: [""],
        firstRefCompany: [""],
        firstRefPhone: [""],
        firstRefEmail: [""],
        secondRefName: [""],
        secondRefCompany: [""],
        secondRefPhone: [""],
        secondRefEmail: [""],
        departmentId: ["", Validators.required],
        organizationRoleId: ["", Validators.required],
        jobGroupId: ["", Validators.required],
        bankName: ["", Validators.required],
        bankAccount: ["", Validators.required],
        confirmBankAccount: ["", Validators.required],
        kraNo: ["", Validators.required],
        nssfNo: ["", Validators.required],
        nhifNo: ["", Validators.required],
        basicSalary: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        totalNonCashBenefit: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        valueOfQuarters: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        ownerOccupiedInterests: [
          "0",
          [Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ],
        personalRelief: ["2400", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        insuranceRelief: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        dcrsActualE2: ["0", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      });
      this.btnColor = "primary";
      this.titleRef = "Employee Creation";
      this.matTabTitle = "CREATE EMPLOYEE";
      this.btnText = "SUBMIT";
      this.showUploadTab = true;
    } else if (this.onData == "VIEW") {
      this.getData();
      this.onSalaryNextbtn = false;
      this, this.disableControlls();
      this.confirmBankAccount = false;
      this.showSubmitTab = false;
      this.showUploadTab = false;
      this.showDependantsDocInputField= false;
      this.showButtons = false;
      this.showWorkExpForm = false;
      this.showEducationForm = false;
      this.showNextOfKinForm = false;
      this.showDependantForm = false;
      this.titleRef = "Employee Details";
      this.matTabTitle = "EMPLOYEE DETAILS";
    } else if (this.onData == "UPDATE") {
      this.getData();
      this.btnColor = "primary";
      this.titleRef = "Update Employee Details";
      this.matTabTitle = "UPDATE EMPLOYEE";
      this.btnText = "UPDATE";
      this.showUploadTab = false;
      this.showDependantsDocInputField= true;
    } else if (this.onData == "UPDATEAPPLICANT") {
      /*this.getData();*/
      this.getSuccessfulApplicant();
      this.btnColor = "primary";
      this.titleRef = "Update Applicant's Details";
      this.matTabTitle = "UPDATE APPLICANT DETAILS";
      this.btnText = "UPDATE APPLICANT";
      this.showUploadTab = false;
      this.showDependantsDocInputField= true;

    } else if (this.onData == "ONBOARD") {
      /*this.getData();*/
      this.getSuccessfulApplicant();
      this.titleRef = "Employee Creation";
      this.btnText = "ONBOARD";
      this.btnColor = "primary";
      this.showUploadTab = false;
      this.showDependantsDocInputField= true;
      
    }
  }

  submitDoc() {
    this.loading = true;
    console.log("Marriage Cert Form", this.marriageCertFormData.value);
    if (!!this.marriageCertFormData) {
      this.dmsAPI
        .onUpload(this.marriageCertFormData.value)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (res) => {
            if (res.statusCode === 201) {
              // this.docsres=  this.notificationAPI.alertSuccess(res.message);
              this.onSuccessResponse();

              this.loading = false;
            } else {
              this.loading = false;
              this.notificationAPI.alertWarning(res.message);
            }
          },
          error: (err) => {
            this.loading = false;
            this.notificationAPI.alertWarning("Server Error: Try Again Later");
          },

          complete: () => {},
        });
    } else {
      this.loading = false;
      this.notificationAPI.alertWarning("Document Form Data is Invalid!!");
    }
  }


  submitDependantDocs() {
    this.loading = true;
    // if (this.dependantsDocs.valid) {
    console.log(
      "Documents from Dependants Main Form====onsubmit",
      this.dependantsDocs.value
    );
    console.log("July Docs Array on submit", this.dependantDocsArray);

    if(this.allDocumentsArray && this.allDocumentsArray.length > 0){
      this.dmsAPI
      .onBulkUpload(this.allDocumentsArray)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res) => {
          console.log("RES", res);
          if (res.statusCode === 201) {
            // this.dmsres=  this.notificationAPI.alertSuccess(res.message);
            this.onSuccessResponse();
            this.loading = false;
          } else {
            this.loading = false;
            this.notificationAPI.alertWarning(res.message);
          }
        },
        error: (err) => {
          this.loading = false;
          this.notificationAPI.alertWarning("Server Error: Try Again Later");
        },

        complete: () => {},
      });
    }
     else {
      this.loading = false;
      this.notificationAPI.alertWarning("Document Form Data is Invalid!!");
    }
  }

  onSubmit() {
    this.loading = true;
    console.log("FORM DATA", this.formData);
    console.log("Submitted Form Data", this.formData.value);

    if (this.onData == "ADD") {
      if (this.formData.valid) {
        this.employeeAPI
          .create(this.formData.value)
          .pipe(takeUntil(this.$destroy))
          .subscribe({
            next: (res) => {
              if (res.statusCode === 201) {
                this.loading = false;
                // this.notificationAPI.alertSuccess(res.message);
                this.submitDependantDocs();
                this.onSuccessResponse();
                this.router.navigate(["/administration/employees/pending"], {
                  skipLocationChange: true,
                });
              } else {
                this.loading = false;
                this.notificationAPI.alertWarning(res.message);
              }
            },
            error: (err) => {
              this.loading = false;
              this.notificationAPI.alertWarning(
                "Server Error: Try Again Later"
              );
            },
            complete: () => {},
          });
      } else {
        this.loading = false;
        this.notificationAPI.alertWarning("Employee Form Data is Invalid!!");
      }
    } else if (this.onData == "ONBOARD"){

      if (this.formData.valid) {
        this.employeeAPI
          .create(this.formData.value)
          .pipe(takeUntil(this.$destroy))
          .subscribe({
            next: (res) => {
              if (res.statusCode === 201) {
                this.loading = false;
                // this.notificationAPI.alertSuccess(res.message);
                this.submitDependantDocs();
                this.onSuccessResponse();
                this.router.navigate(["/administration/employees/pending"], {
                  skipLocationChange: true,
                });
              } else {
                this.loading = false;
                this.notificationAPI.alertWarning(res.message);
              }
            },
            error: (err) => {
              this.loading = false;
              this.notificationAPI.alertWarning(
                "Server Error: Try Again Later"
              );
            },
            complete: () => {},
          });
      }

      else {
        this.loading = false;
        this.notificationAPI.alertWarning("Employee Form Data is Invalid!!");
      }



    }
    else if (this.onData == "UPDATE") {
      console.log("From create component:", this.formData.value);
      this.employeeAPI
        .update(this.formData.value)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (res) => {
            if (res.statusCode === 200) {
              this.loading = false;
              this.notificationAPI.alertSuccess(res.message);
              this.submitDependantDocs();
              this.results = res.entity;
              if (this.results.employeeStatus == "Pending") {
                this.router.navigate(["/administration/employees/pending"], {
                  skipLocationChange: true,
                });
              } else if (this.results.employeeStatus == "Approved") {
                this.router.navigate(["/administration/employees/approved"], {
                  skipLocationChange: true,
                });
              }
              if (this.results.employeeStatus == "Dormant") {
                this.router.navigate(["/administration/employees/dormant"], {
                  skipLocationChange: true,
                });
              }
              if (this.results.employeeStatus == "Removed") {
                this.router.navigate(["/administration/employees/removed"], {
                  skipLocationChange: true,
                });
              }
            } else {
              this.loading = false;
              this.notificationAPI.alertWarning(res.message);
            }
          },
          error: (err) => {
            this.loading = false;
            this.notificationAPI.alertWarning("Server Error: Try Again Later");
          },
          complete: () => {},
        });
    }
    else if (this.onData == "UPDATEAPPLICANT"){

      console.log("Updating Applicant Details", this.formData.value)
      this.applicantService
      .update(this.formData.value)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res) => {

          
          if (res.statusCode === 200) {
            this.loading = false;
            this.notificationAPI.alertSuccess(res.message);
            this.submitDependantDocs();
            this.results = res.entity;
            if (this.results.employeeStatus == "Pending") {
              this.router.navigate(["/administration/employees/pending"], {
                skipLocationChange: true,
              });
            } else if (this.results.employeeStatus == "Approved") {
              this.router.navigate(["/administration/employees/approved"], {
                skipLocationChange: true,
              });
            }
            if (this.results.employeeStatus == "Dormant") {
              this.router.navigate(["/administration/employees/dormant"], {
                skipLocationChange: true,
              });
            }
            if (this.results.employeeStatus == "Removed") {
              this.router.navigate(["/administration/employees/removed"], {
                skipLocationChange: true,
              });
            }
          } else {
            this.loading = false;
            this.notificationAPI.alertWarning(res.message);
          }
        },
        error: (err) => {
          this.loading = false;
          this.notificationAPI.alertWarning("Server Error: Try Again Later");
        },
        complete: () => {},
      });
    }
  }
}
