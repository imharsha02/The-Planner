import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { TypographyH4 } from "@/components/ui/Typography/TypographyH4";
import React from "react";

const Home = () => {
  return (
    <div className="flex items-center space-x-3 py-3">
      <TypographyH4>
        What department&apos;s project do you want to work on?
      </TypographyH4>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent className="max-h-[500px] overflow-y-auto">
          {/* Architecture & Design */}
          <SelectItem value="architecture-and-design">
            Architecture & Design
          </SelectItem>

          {/* Engineering */}
          <SelectItem value="engineering">Engineering</SelectItem>

          {/* Technology */}
          <SelectItem value="technology-and-software">
            Technology & Software
          </SelectItem>

          {/* Healthcare */}
            <SelectItem value="healthcare-and-medical">Healthcare & Medical</SelectItem>

          {/* Business & Finance */}
            <SelectItem value="business-and-finance">Business & Finance</SelectItem>
            

          {/* Creative Arts */}
            <SelectItem value="creativearts-and-media">Creative Arts & Media</SelectItem>

          {/* Education */}
            <SelectItem value="education-and-research">Education & Research</SelectItem>
          
          {/* Science */}
            <SelectItem value="scientific-research">Scientific Research</SelectItem>

          {/* Social Impact */}
          <SelectGroup>
            <SelectLabel>Social Impact & Nonprofit</SelectLabel>
            <SelectItem value="social-enterprise">Social Enterprise</SelectItem>
            <SelectItem value="community-development">
              Community Development
            </SelectItem>
            <SelectItem value="environmental-conservation">
              Environmental Conservation
            </SelectItem>
            <SelectItem value="humanitarian-aid">
              Humanitarian Aid Project
            </SelectItem>
          </SelectGroup>

          {/* Agriculture & Environment */}
          <SelectGroup>
            <SelectLabel>Agriculture & Environment</SelectLabel>
            <SelectItem value="sustainable-agriculture">
              Sustainable Agriculture
            </SelectItem>
            <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
            <SelectItem value="conservation">Conservation Project</SelectItem>
            <SelectItem value="climate-change-research">
              Climate Change Research
            </SelectItem>
          </SelectGroup>

          {/* Manufacturing & Industry */}
          <SelectGroup>
            <SelectLabel>Manufacturing & Industry</SelectLabel>
          </SelectGroup>

          {/* Additional Unique Fields */}
          <SelectGroup>
            <SelectLabel>Miscellaneous & Unique Fields</SelectLabel>
            <SelectItem value="space-exploration">Space Exploration</SelectItem>
            <SelectItem value="forensic-science">Forensic Science</SelectItem>
            <SelectItem value="archaeological-research">
              Archaeological Research
            </SelectItem>
            <SelectItem value="disaster-management">
              Disaster Management
            </SelectItem>
            <SelectItem value="cultural-preservation">
              Cultural Preservation
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Home;
