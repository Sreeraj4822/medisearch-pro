export type Medicine = {
  id: string;
  name: string;
  genericName: string;
  description: string;
  uses: string[];
  sideEffects: string[];
  dosages: string;
  interactions: string;
  dataSource: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  qualifications: string[];
  experienceYears: number;
  insurances: string[];
  reviews: {
    count: number;
    rating: number;
  };
  image: {
    url: string;
    hint: string;
  };
  dataSource: string;
};

export type Hospital = {
  id: string;
  name: string;
  location: string;
  contact: string;
  services: string[];
  reviews: {
    count: number;
    rating: number;
  };
  image: {
    url: string;
    hint: string;
  };
  dataSource: string;
};

export type Reminder = {
  id: string;
  doctorName: string;
  checkupDate: Date;
  notes: string;
};
