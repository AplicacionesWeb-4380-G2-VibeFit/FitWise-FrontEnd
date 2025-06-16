export class Certificate {
    constructor({
                    id = "",
                    userId= "",
                    institution= "",
                    dateObtained= "",
                    description= "",
                    status= "",
                    certificateCode= "",
                    yearsOfWork= 0
                }) {
        this.id = id;
        this.userId = userId;
        this.institution = institution;
        this.dateObtained = dateObtained;
        this.description = description;
        this.status = status;
        this.certificateCode = certificateCode;
        this.yearsOfWork = yearsOfWork;
    }
}