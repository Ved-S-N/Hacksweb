import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Code, Settings, Eye } from 'lucide-react';

interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  role?: string;
}

interface TeamTechDisplayProps {
  teamMembers: TeamMember[];
  technologies: string[];
  features: string[];
  readOnly?: boolean;
  onEditClick?: () => void;
}

const TeamTechDisplay: React.FC<TeamTechDisplayProps> = ({
  teamMembers,
  technologies,
  features,
  readOnly = false,
  onEditClick
}) => {
  return (
    <div className="space-y-6">
      {readOnly && onEditClick && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Edit Submission
          </Button>
        </div>
      )}

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers && teamMembers.length > 0 ? (
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{member.email}</p>
                  </div>
                  <Badge variant="outline">{member.role || "Member"}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No team members added</p>
          )}
        </CardContent>
      </Card>

      {/* Technologies Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Technologies Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          {technologies && technologies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No technologies specified</p>
          )}
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          {features && features.length > 0 ? (
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No features specified</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamTechDisplay;
